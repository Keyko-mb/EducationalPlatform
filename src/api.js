import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";

axios.defaults.baseURL = 'http://localhost:8084/v1/api/';

axios.interceptors.request.use(config => {
    const authStore = useAuthStore()
    config.headers.Authorization = `Bearer ${authStore.userInfo.token}`

    return config
})