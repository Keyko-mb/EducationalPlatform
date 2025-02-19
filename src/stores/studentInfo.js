import {defineStore} from "pinia";
import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";
import {useThemeStore} from "@/stores/theme.js";

export const useStudentStore = defineStore('student', {
    state: () => ({
        studentId: null,
        firstName: "",
        lastName: "",
        patronymic: null,
        classroomId: null,
        curriculumId: null,
        settings: null
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
        },
        fetchSettings() {
            const themeStore = useThemeStore();
            if (this.settings) {
                if (this.settings.theme) {
                    const themeMapping = {
                        'Светлый': 'theme-light',
                        'Темный': 'theme-dark',
                        'Голубой': 'theme-blue'
                    };
                    themeStore.setTheme(themeMapping[this.settings.theme.name] || '');
                }
                if (this.settings.fontSize) {
                    const fontSizeMapping = {
                        'Нормальный': 'normal',
                        'Увеличенный': 'large',
                        'Большой': 'xlarge'
                    };
                    themeStore.setFontSize(fontSizeMapping[this.settings.fontSize.name] || 'normal');
                }
                if (this.settings.isSerif) {
                    themeStore.setFontFamily(this.settings.isSerif ? 'serif' : 'Nunito, sans-serif');
                }
            }
        }
    },
    persist: true
})