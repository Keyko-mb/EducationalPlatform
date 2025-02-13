import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";

axios.defaults.baseURL = 'http://localhost:8084/v1/api/';


axios.interceptors.request.use(config => {
    const url = config.url
    if (!url.includes('auth')) {
        const authStore = useAuthStore()
        config.headers.Authorization = `Bearer ${authStore.userInfo.token}`
    }
    return config
})

axios.interceptors.response.use(
    response => response,
    async error => {
        const authStore = useAuthStore();
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!storedUserInfo?.refresh_token) {
                authStore.logOut();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post('auth/refresh-token', null, {
                    headers: {
                        'Authorization': `Bearer ${storedUserInfo.refresh_token}`
                    }
                });

                const newToken = response.data;
                authStore.userInfo.token = newToken.access_token;
                authStore.userInfo.refresh_token = newToken.refresh_token;
                localStorage.setItem('userInfo', JSON.stringify(authStore.userInfo));

                return axios(originalRequest);
            } catch (refreshError) {
                console.log('Ошибка при обновлении токена:', refreshError);
                authStore.logOut();
            }
        }
        return Promise.reject(error);
    }
);
