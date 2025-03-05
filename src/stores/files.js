import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import ToastMessage from "@/components/UI/ToastMessage.vue";
import { h } from "vue";

export const useFilesStore = defineStore("files", () => {
    const decodedFiles = ref([]);
    const images = ref([]);
    const links = ref([]);
    const toast = useToast();

    const fetchFile = async (baseUrl, id, file) => {
        try {
            const response = await axios.get(`${baseUrl}/${id}/attachments/${file}`, {
                responseType: "blob",
            });
            const contentType = response.headers["content-type"];
            const contentDisposition = response.headers["content-disposition"];
            let fileName = file;
            if (contentDisposition) {
                const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = fileNameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }
            const fileURL = URL.createObjectURL(response.data);

            decodedFiles.value.push({
                name: file,
                fileName: fileName,
                url: fileURL,
                type: contentType,
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Неизвестная ошибка при загрузке файла";
            console.error("Ошибка при загрузке файла:", error);
            toast.error(h(ToastMessage, { message: "Ошибка загрузки файла", details: { info: errorMessage } }));
        }
    };

    const uploadFile = async (baseUrl, id, file) => {
        const formData = new FormData();
        formData.append('image', file);
        const toast = useToast();
        try {
            const response = await axios.post(`${baseUrl}/${id}/attachments`, formData);
            if (!response.data.error) {
                return response.data;
            } else {
                throw new Error(response.data.error || "Ошибка при загрузке файла на сервер");
            }
        } catch (error) {
            const errorMessage = error.response?.status === 413
                ? "Файл слишком большой для загрузки (превышен лимит сервера)"
                : error.response?.data?.error || error.message || "Неизвестная ошибка при загрузке";
            console.error("Ошибка при загрузке вложения:", error);
            toast.error(h(ToastMessage, { message: "Ошибка загрузки файла", details: { info: errorMessage } }));
            return null;
        }
    };

    const refreshFiles = () => {
        decodedFiles.value.sort((a, b) => {
            const isImageA = a.type.startsWith('image/');
            const isImageB = b.type.startsWith('image/');
            if (isImageA && !isImageB) return -1;
            if (!isImageA && isImageB) return 1;
            return 0;
        });
        images.value = decodedFiles.value.filter(
            (file) => file.type && file.type.startsWith("image/")
        );
        links.value = decodedFiles.value.filter(
            (file) => file.type && !file.type.startsWith("image/")
        );
    };

    const deleteFile = async (baseUrl, id, name) => {
        try {
            await axios.delete(`${baseUrl}/${id}/attachments/${name}`);
            decodedFiles.value = decodedFiles.value.filter((f) => f.name !== name);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Неизвестная ошибка при удалении файла";
            console.error("Ошибка при удалении файла:", error);
            toast.error(h(ToastMessage, { message: "Ошибка удаления файла", details: { info: errorMessage } }));
        }
    };

    const clearFiles = () => {
        decodedFiles.value = [];
        images.value = [];
        links.value = [];
    };

    return {
        decodedFiles,
        images,
        links,
        fetchFile,
        refreshFiles,
        clearFiles,
        uploadFile,
        deleteFile
    };
});