import {defineStore} from "pinia";
import axios from "axios";

export const useMaterialsStore = defineStore('materials', {
    state: () => ({
        courses: [],
        lessons: [],
        homeworks: [],
    }),

    actions: {
        async fetchCourses() {
            await axios.get(`courses`).then((response) => {
                this.courses = response.data
            })
        },

        async fetchLessons() {
            await axios.get(`lessons`).then((response) => {
                this.lessons = response.data
            })
        },

        async fetchHomeworks() {
            await axios.get(`homeworks`).then((response) => {
                this.homeworks = response.data
            })
        },

    }
})