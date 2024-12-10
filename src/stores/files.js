import axios from "axios";
import {defineStore} from "pinia";
import {ref} from "vue";

export const useFilesStore = defineStore("files", () => {
    const decodedFiles = ref([]);
    const images = ref([]);
    const links = ref([]);

    const fetchFile = async (baseUrl, id, file) => {
        try {
            const response = await axios.get(`${baseUrl}/${id}/attachments/${file}`, {
                responseType: "blob",
            });
            const contentType = response.headers["content-type"];
            const fileURL = URL.createObjectURL(response.data);

            decodedFiles.value.push({
                name: file,
                url: fileURL,
                type: contentType,
            });
        } catch (error) {
            console.error("Ошибка при загрузке файла:", error);
        }
    }

    const uploadFile = async (baseUrl, id, file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post(`${baseUrl}/${id}/attachments`, formData)
            return response.data;
        } catch (error) {
            console.error("Ошибка при загрузке вложения:", error);
        }
    }

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
    }

    const deleteFile = async (baseUrl, id, file) => {
        await axios.delete(`${baseUrl}/${id}/attachments/${file}`);
        decodedFiles.value = decodedFiles.value.filter((f) => f.name !== file);
    }

    const clearFiles = () => {
        decodedFiles.value = [];
        images.value = [];
        links.value = [];
    }

    return {
        decodedFiles,
        images,
        links,
        fetchFile,
        refreshFiles,
        clearFiles,
        uploadFile,
        deleteFile
    }
})