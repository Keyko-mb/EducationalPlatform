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
        curricula: [],
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
                    this.settings = response.data.settings
                    if (response.data.classroomId) {
                        this.classroomId = response.data.classroomId
                        axios
                            .get(`classrooms/${this.classroomId}/curriculum`)
                            .then((response) => {
                                if (response.data) {
                                    this.curricula = response.data
                                }
                            })
                    }
                })
        },
        fetchSettings() {
            const themeStore = useThemeStore();
            if (this.settings) {
                if (this.settings.theme) {
                    themeStore.setTheme(this.settings.theme.name, false);
                }
                if (this.settings.fontSize) {
                    themeStore.setFontSize(this.settings.fontSize.name);
                }
                if (this.settings.isSerif !== null) {
                    themeStore.setFontFamily(this.settings.isSerif );
                }
                if (this.settings.lineHeight) {
                    themeStore.setLineHeight(this.settings.lineHeight.name );
                }
                if (this.settings.letterSpacing) {
                    themeStore.setLetterSpacing(this.settings.letterSpacing.name );
                }
                if (this.settings.imgHiding !== null) {
                    themeStore.setImgHiding(this.settings.imgHiding);
                }
            } else {
                themeStore.applyPersistedSettings();
            }
        }
    },
    persist: true
})