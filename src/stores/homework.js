import axios from "axios";
import {defineStore} from "pinia";

export const useHomeworkStore = defineStore('homework', {
     state: () => ({
         homework: null,
         answers: []
     }),

     actions: {
         async fetchHomework(id) {
             await axios.get(`homeworks/${id}`).then((response) => {
                 this.homework = response.data
             })
         },

         async fetchAnswers(id) {
             await axios.get(`homeworks/${id}/answers`).then((response) => {
                 this.answers = response.data
                 if (this.answers.length) {
                     axios
                         .get('people')
                         .then((response) => {
                             const people = response.data
                             if (people.length) {
                                 this.answers = this.answers.map(answer => {
                                     const student = people.find(student => student.id === answer.studentId);
                                     if (student) {
                                         return {...answer, student: student || null};
                                     }
                                 })
                             }
                         })
                 }
             })
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