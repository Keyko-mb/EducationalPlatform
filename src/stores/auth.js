import { defineStore } from 'pinia';
import axios from "axios";
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref({
        person: null,
        token: '',
        refresh_token: ''
    })

    const signIn = (payload) => {
        try {
            axios.post('auth/login', {
                username: payload.username,
                password: payload.password
            }).then((response) => {
                console.log(response)
                userInfo.value = {
                    person: response.data.person,
                    token: response.data.access_token,
                    refresh_token: response.data.refresh_token
                }
            })
        } catch (error) {
            console.error('Ошибка при аутентификации:', error);
        }
    }
    return {signIn, userInfo}
});
