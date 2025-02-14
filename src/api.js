import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";
import router from '@/router';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axios.defaults.baseURL = 'http://localhost:8084/v1/api/';

axios.interceptors.request.use(config => {
    const url = config.url
    if (!url.includes('auth')) {
        const authStore = useAuthStore()
        config.headers.Authorization = `Bearer ${authStore.userInfo.token}`
    }
    return config
});

axios.interceptors.response.use(
    response => response,
    async error => {
        const authStore = useAuthStore();
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && authStore.isAuthenticated) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!storedUserInfo?.refresh_token) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post('auth/refresh-token', null, {
                    headers: {
                        Authorization: `Bearer ${storedUserInfo.refresh_token}`
                    }
                });

                authStore.userInfo.token = response.data.access_token;
                authStore.userInfo.refresh_token = response.data.refresh_token;
                localStorage.setItem('userInfo', JSON.stringify(authStore.userInfo));

                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

                processQueue(null, response.data.access_token);

                return axios(originalRequest);
            } catch (refreshError) {
                // Если refresh token невалиден - полный выход
                processQueue(refreshError, null);
                await authStore.logOut();
                await router.push({
                    path: '/signIn',
                    query: {
                        sessionExpired: true
                    }
                });
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export function initializeToastInterceptor(toast) {
    axios.interceptors.response.use(
        response => response,
        error => {
            const status = error.response?.status;
            const message = error.response?.data?.error;
            const details = error.response?.data?.details ? Object.values(error.response?.data?.details).join('\n') : 'Произошла ошибка';

            // Обработка специфических статусов
            switch (status) {
                case 401:
                    toast.add({ severity: 'warn', summary: message, detail: details, life: 5000 });
                    break;
                case 403:
                    toast.add({ severity: 'error', summary: message, detail: details, life: 5000 });
                    break;
                case 404:
                    toast.add({ severity: 'warn', summary: message, detail: details, life: 5000 });
                    break;
                default:
                    toast.add({ severity: 'error', summary: message, detail: details, life: 5000 });
            }

            return Promise.reject(error);
        }
    );
}