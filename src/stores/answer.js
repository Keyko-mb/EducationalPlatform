import axios from "axios";
import {defineStore} from "pinia";
import {useHomeworkStore} from "@/stores/homework.js";
import {useStudentStore} from "@/stores/studentInfo.js";

export const useAnswerStore = defineStore('answer', {
    state: () => ({
        answer: null,
        decodedFiles: [],
        images: [],
        links: [],
    }),

    actions: {
        fetchAnswer(homeworkId) {
            const studentStore = useStudentStore()
            axios
                .get(`people/${studentStore.studentId}/answer`)
                .then(async (response) => {
                    const answers = response.data
                    if (answers) {
                        const studentAnswer = answers.find(answer => answer.homeworkId === homeworkId);
                        if (studentAnswer) {
                            this.answer = studentAnswer
                            if (studentAnswer.attachments) {
                                for (const file of studentAnswer.attachments) {
                                    await this.fetchFile(studentAnswer.id, file)
                                }
                                this.refreshFiles()
                            }
                        }
                    }
                })
        },

        submitAnswer(answer, newFiles) {
            axios
                .post('answers', answer)
                .then(async (response) => {
                    this.answer = response.data
                    for (const file of newFiles) {
                        const filename = await this.uploadFile(this.answer.id, file);
                        await this.fetchFile(this.answer.id, filename);
                        this.answer.attachments.push(filename);
                    }
                    this.refreshFiles()
                })

        },

        updateAnswer(id, updatedAnswer) {
            axios
                .put(`answers/${id}`, updatedAnswer)
                .then((response) => {
                    this.answer = response.data
                })
        },

        async updateComment(answer, comment) {
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
                console.error("Ошибка при обновлении комментария:", error);
            }
        },

        async fetchFile(id, file) {
            try {
                const response = await axios.get(`answers/${id}/attachments/${file}`, {
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

                this.decodedFiles.push({
                    name: file,
                    fileName: fileName,
                    url: fileURL,
                    type: contentType,
                });
            } catch (error) {
                console.error("Ошибка при загрузке файла:", error);
            }
        },

        async uploadFile(id, file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const response = await axios.post(`answers/${id}/attachments`, formData)
                return response.data;
            } catch (error) {
                console.error("Ошибка при загрузке вложения:", error);
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
            await axios.delete(`answers/${id}/attachments/${file}`);
            this.decodedFiles = this.decodedFiles.filter((f) => f.name !== file);
        },

        clearAnswer() {
            this.answer = null
            this.decodedFiles = [];
            this.images = [];
            this.links = [];
        },
    }
})