import axios from "axios";
import { defineStore } from "pinia";
import { useHomeworkStore } from "@/stores/homework.js";
import { useStudentStore } from "@/stores/studentInfo.js";
import { useToast } from "vue-toastification";
import ToastMessage from "@/components/UI/ToastMessage.vue";
import { h } from "vue";

export const useAnswerStore = defineStore('answer', {
    state: () => ({
        answer: null,
        decodedFiles: [],
        images: [],
        links: [],
    }),

    actions: {
        async fetchAnswer(homeworkId) {
            const studentStore = useStudentStore();
            const toast = useToast();
            try {
                const response = await axios.get(`people/${studentStore.studentId}/answer`);
                const answers = response.data;
                if (answers) {
                    const studentAnswer = answers.find(answer => answer.homeworkId === homeworkId);
                    if (studentAnswer) {
                        this.answer = studentAnswer;
                        if (studentAnswer.attachments) {
                            for (const file of studentAnswer.attachments) {
                                await this.fetchFile(studentAnswer.id, file);
                            }
                            this.refreshFiles();
                        }
                    }
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.message || "Неизвестная ошибка при получении ответа";
                console.error("Ошибка при получении ответа:", error);
                toast.error(h(ToastMessage, { message: "Ошибка получения ответа", details: { info: errorMessage } }));
            }
        },

        async submitAnswer(answer, newFiles) {
            const toast = useToast();
            try {
                const response = await axios.post('answers', answer);
                this.answer = response.data;
                for (const file of newFiles) {
                    try {
                        const filename = await this.uploadFile(this.answer.id, file);
                        if (filename) { // Только если filename не null
                            await this.fetchFile(this.answer.id, filename);
                            this.answer.attachments.push(filename);
                        }
                    } catch (error) {
                        console.error(`Ошибка загрузки файла ${file.name}:`, error);
                        toast.error(h(ToastMessage, { message: "Ошибка загрузки файла", details: { info: error.message } }));
                    }
                }
                this.refreshFiles();
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.message || "Неизвестная ошибка при отправке ответа";
                console.error("Ошибка при отправке ответа:", error);
                toast.error(h(ToastMessage, { message: "Ошибка отправки ответа", details: { info: errorMessage } }));
                return null;
            }
        },

        async updateAnswer(id, updatedAnswer) {
            const toast = useToast();
            try {
                const response = await axios.put(`answers/${id}`, updatedAnswer);
                this.answer = response.data;
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.message || "Неизвестная ошибка при обновлении ответа";
                console.error("Ошибка при обновлении ответа:", error);
                toast.error(h(ToastMessage, { message: "Ошибка обновления ответа", details: { info: errorMessage } }));
            }
        },

        async updateComment(answer, comment) {
            const toast = useToast();
            try {
                const response = await axios.put(`answers/${answer.id}`, { ...answer, comment: comment });
                this.answer = response.data;

                const homeworkStore = useHomeworkStore();
                const answerIndex = homeworkStore.answers.findIndex(a => a.id === answer.id);
                if (answerIndex !== -1) {
                    homeworkStore.answers[answerIndex].comment = response.data.comment;
                }
                return response.data;
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.message || "Неизвестная ошибка при обновлении комментария";
                console.error("Ошибка при обновлении комментария:", error);
                toast.error(h(ToastMessage, { message: "Ошибка обновления комментария", details: { info: errorMessage } }));
            }
        },

        async fetchFile(id, file) {
            const toast = useToast();
            try {
                const response = await axios.get(`answers/${id}/attachments/${file}`, {
                    responseType: "blob",
                });
                const contentType = response.headers["content-type"];
                const contentDisposition = response.headers["content-disposition"];
                let fileName = file;
                if (contentDisposition) {
                    const filenameStarRegex = /filename\*=UTF-8''([^;]*)/i;
                    const starMatches = filenameStarRegex.exec(contentDisposition);
                    if (starMatches && starMatches[1]) {
                        fileName = decodeURIComponent(starMatches[1]);
                    } else {
                        const filenameRegex = /filename="?([^";]*)"?/i;
                        const matches = filenameRegex.exec(contentDisposition);

                        if (matches && matches[1]) {
                            fileName = matches[1];
                        }
                    }
                }
                const fileURL = URL.createObjectURL(response.data);

                this.decodedFiles.push({
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
        },

        async uploadFile(id, file) {
            const formData = new FormData();
            formData.append('image', file);
            const toast = useToast();
            try {
                const response = await axios.post(`answers/${id}/attachments`, formData);
                return response.data;
            } catch (error) {
                const errorMessage = error.response?.status === 413
                    ? "Файл слишком большой для загрузки (превышен лимит сервера)"
                    : error.response?.data?.error || error.message || "Неизвестная ошибка при загрузке";
                console.error("Ошибка при загрузке вложения:", error);
                toast.error(h(ToastMessage, { message: "Ошибка загрузки файла", details: { info: errorMessage } }));
                return null; // Возвращаем null при ошибке
            }
        },

        refreshFiles() {
            this.decodedFiles.sort((a, b) => {
                const isImageA = a.type.startsWith('image/');
                const isImageB = b.type.startsWith('image/');
                if (isImageA && !isImageB) return -1;
                if (!isImageA && isImageB) return 1;
                return 0;
            });
            this.images = this.decodedFiles.filter(
                (file) => file.type && file.type.startsWith("image/")
            );
            this.links = this.decodedFiles.filter(
                (file) => file.type && !file.type.startsWith("image/")
            );
        },

        async deleteFile(id, file) {
            const toast = useToast();
            try {
                await axios.delete(`answers/${id}/attachments/${file}`);
                this.decodedFiles = this.decodedFiles.filter((f) => f.name !== file);
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.message || "Неизвестная ошибка при удалении файла";
                console.error("Ошибка при удалении файла:", error);
                toast.error(h(ToastMessage, { message: "Ошибка удаления файла", details: { info: errorMessage } }));
            }
        },

        clearAnswer() {
            this.answer = null;
            this.decodedFiles = [];
            this.images = [];
            this.links = [];
        },
    }
});