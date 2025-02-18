import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";
import router from "@/router";
import { useToast } from "vue-toastification";
import ToastMessage from "@/components/UI/ToastMessage.vue";
import { h } from "vue";

// Возвращаем установку глобального базового URL
axios.defaults.baseURL = "http://localhost:8084/v1/api/";

let isRefreshing = false;
let failedQueue = [];
let authStore;

const processQueue = (error, token = null) => {
    try {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    } catch (queueError) {
        console.error("Error while processing queue:", queueError);
    }
};

// Создаем отдельный экземпляр axios для refresh-запросов
const axiosPublic = axios.create({
    baseURL: "http://localhost:8084/v1/api/"
});

axios.interceptors.request.use(config => {
    const url = config.url;
    if (!url.includes("auth")) {
        if (!authStore) authStore = useAuthStore();
        config.headers.Authorization = `Bearer ${authStore.userInfo.token}`;
    }
    return config;
});

let caughtError = null;

axios.interceptors.response.use(
    response => response,
    async error => {
        if (!error.response) { // Обработка сетевых ошибок
            console.error("Network Error:", error);
            return Promise.reject(error);
        }

        if (!authStore) authStore = useAuthStore();
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest.url?.includes("auth/refresh-token");

        if (error.response?.status === 401 && !originalRequest._retry && authStore.isAuthenticated) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
                if (!storedUserInfo?.refresh_token) {
                    throw new Error("No refresh token available");
                }
                const response = await axiosPublic.post("auth/refresh-token", null, {
                    headers: {
                        Authorization: `Bearer ${storedUserInfo.refresh_token}`
                    }
                });
                // Обновляем токены
                authStore.userInfo.token = response.data.access_token;
                authStore.userInfo.refresh_token = response.data.refresh_token;
                localStorage.setItem("userInfo", JSON.stringify(authStore.userInfo));
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                processQueue(null, response.data.access_token);
                return axios(originalRequest);
            } catch (error) {
                await authStore.logOut();
                await router.push("/signIn");
                caughtError = error;
                return Promise.reject({ ...error, isRefreshTokenFailure: true });
            } finally {
                processQueue(caughtError || null, null);
                isRefreshing = false;
            }
        }

        if (isRefreshRequest && error.response?.status === 401) {
            await authStore.logOut();
            await router.push("/signIn");
            return Promise.reject({
                ...error,
                isRefreshTokenFailure: true
            });
        }

        return Promise.reject(error);
    }
);

export function initializeToastInterceptor() {
    const toast = useToast();

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.isRefreshTokenFailure) {
                return Promise.reject(error);
            }

            const status = error.response?.status;
            const message = error.response?.data?.error;
            const details = error.response?.data?.details;

            const toastContent = h(ToastMessage, { message, details });
            switch (status) {
                case 401:
                    toast.error(toastContent);
                    break;
                case 403:
                    toast.error(toastContent);
                    break;
                case 404:
                    toast.warning(toastContent);
                    break;
                default:
                    toast.error(toastContent);
            }

            return Promise.reject(error);
        }
    );
}
