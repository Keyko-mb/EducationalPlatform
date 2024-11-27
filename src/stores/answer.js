import axios from "axios";
import {defineStore} from "pinia";
import {useHomeworkStore} from "@/stores/homework.js";
import {useStudentStore} from "@/stores/studentInfo.js";

export const useAnswerStore = defineStore('answer', {
    state: () => ({
        answer: null
    }),

    actions: {
        fetchAnswer(homeworkId) {
            const studentStore = useStudentStore()

            // const homeworkStore = useHomeworkStore();
            // homeworkStore.fetchAnswers(homeworkId)
            // const answerIndex = homeworkStore.answers.find(answer => answer.studentId === studentStore.studentId);

            axios
                .get(`people/${studentStore.studentId}/answer`)
                .then((response) => {
                    const answers = response.data
                    if (answers) {
                        const studentAnswer = answers.find(answer => answer.homeworkId === homeworkId);
                        if (studentAnswer) {
                            this.answer = studentAnswer
                        }
                    }
                })
        },

        submitAnswer(answer) {
            axios
                .post('answers', answer)
                .then((response) => {
                    this.answer = response.data
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
            } catch (error) {
                console.error("Ошибка при обновлении комментария:", error);
            }
        }
    }
})