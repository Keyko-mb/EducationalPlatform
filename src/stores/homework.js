import axios from "axios";
import {defineStore} from "pinia";

export const useHomeworkStore = defineStore('homework', {
     state: () => ({
         homework: null,
         answers: [],
         totalPages: 0
     }),

     actions: {
         async fetchHomework(id) {
             await axios.get(`homeworks/${id}`).then((response) => {
                 this.homework = response.data
             })
         },

         async fetchAnswers(id, page = 0, pageSize = 10) {
             try {
                 const response = await axios.get("answers/paginated", {
                     params: {
                         offset: page,
                         pageSize: pageSize
                     }
                 });
                 // Обновляем список ответов и общее количество
                 this.answers = response.data.content;
                 this.totalPages = response.data.totalPages;

                 // Если необходимо, сопоставляем данные по студентам
                 if (this.answers && this.answers.length) {
                     axios.get("people")
                         .then((res) => {
                             const people = res.data;
                             if (people && people.length) {
                                 this.answers = this.answers.map(answer => {
                                     const student = people.find(student => student.id === answer.studentId);
                                     return { ...answer, student: student || null };
                                 });
                             }
                         });
                 }
             } catch (error) {
                 console.error("Ошибка при загрузке ответов:", error);
             }
         },

         async updateHomework(id, updatedHomework) {
             try {
                 await axios
                     .put(`homeworks/${id}`, updatedHomework)
                     .then((response) => {
                         this.homework = response.data
                     })
             } catch (error) {
                 console.error("Ошибка при обновлении домашнего задания:", error);
             }

         },

         deleteHomework(id) {
             try {
                 axios
                     .delete(`homeworks/${id}`)
                     .then(() => {
                         this.homework = null
                     })
             } catch (error) {
                 console.error("Ошибка при удалении домашнего задания:", error);
             }
         },

         clearHomework() {
             this.answers = []
             this.homework = null
         }
     }
 })