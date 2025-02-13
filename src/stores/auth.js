import { defineStore } from 'pinia';
import axios from "axios";
import {computed, ref} from "vue";
import {useStudentStore} from "@/stores/studentInfo.js";
import {useRouter} from "vue-router";

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

            localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

            const studentStore = useStudentStore()
            await studentStore.initStudent()
        } catch (error) {
            console.error('Ошибка при аутентификации:', error);
        }
    }

    const logOut = () => {
        userInfo.value = {
            id: null,
            role: null,
            token: null,
            refresh_token: null
        }
        localStorage.removeItem('userInfo');

        const router = useRouter()
        router.push('/signIn');
    }

    return {signIn, logOut, userInfo, isAuthenticated}
});