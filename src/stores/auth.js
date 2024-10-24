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

    const signIn = (payload) => {
        try {
            axios.post('auth/login', {
                username: payload.username,
                password: payload.password
            }).then((response) => {
                userInfo.value = {
                    id: response.data.person.id,
                    role: response.data.person.role,
                    token: response.data.access_token,
                    refresh_token: response.data.refresh_token
                }
                const studentStore =useStudentStore()
                studentStore.initStudent()
                localStorage.setItem('userInfo', JSON.stringify({id: userInfo.value.id, role: userInfo.value.role, token: userInfo.value.token, refresh_token: userInfo.value.refresh_token}))
            })
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
    }

    return {signIn, logOut, userInfo, isAuthenticated}
});
