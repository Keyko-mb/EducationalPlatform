import {defineStore} from "pinia";
import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";

export const useStudentStore = defineStore('student', {
    state: () => ({
        studentId: null,
        firstName: null,
        lastName: null,
        patronymic: null,
        classroomId: null,
        curriculumId: null,
    }),
    actions: {
        async initStudent() {
            const authStore = useAuthStore()
            this.studentId = authStore.userInfo.id

            await axios
                .get('people/' + this.studentId).then((response) => {
                    this.firstName = response.data.firstName
                    this.lastName = response.data.lastName
                    this.patronymic = response.data.patronymic
                    if (response.data.classroomId) {
                        this.classroomId = response.data.classroomId
                        axios
                            .get(`classrooms/${this.classroomId}/curriculum`)
                            .then((response) => {
                                if (response.data) {
                                    this.curriculumId = response.data
                                }
                            })
                    }
                })
        }
    }
})