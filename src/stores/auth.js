import { defineStore } from 'pinia';
import axios from "axios";
import {computed, ref} from "vue";
import {useStudentStore} from "@/stores/studentInfo.js";

export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref({
        id: null,
        role: null,
        token: null,
        refresh_token: null
    })
    const isAuthenticated = computed(() => userInfo.value.token !== null);

    const signIn = async (payload) => {
        try {
            const response = await axios.post('auth/login', {
                username: payload.username,
                password: payload.password
            });

            userInfo.value = {
                id: response.data.person.id,
                role: response.data.person.role,
                token: response.data.access_token,
                refresh_token: response.data.refresh_token
            };

            await localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

            const studentStore = useStudentStore()
            await studentStore.initStudent();
            await studentStore.fetchSettings();
            return { success: true};
        } catch (error) {
            console.error('Ошибка при аутентификации:', error);
            return { success: false};
        }
    }

    const logOut = () => {
        userInfo.value = {
            id: null,
            role: null,
            token: null,
            refresh_token: null
        }
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('userInfo');
        localStorage.removeItem('student');
    }

    return {signIn, logOut, userInfo, isAuthenticated}
});