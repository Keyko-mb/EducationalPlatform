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

// axios.interceptors.response.use((response) => {
//     return response
// }, (error) => {
//     const authStore = useAuthStore()
//     const originalRequest = error.config
//     if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true
//         try {
//             axios.post('auth/refresh-token', {
//                 refresh_token: JSON.parse(localStorage.getItem('userInfo')).refresh_token
//             }).then((response) => {
//                 const newToken = response.data
//                 authStore.userInfo.token = newToken.access_token
//                 authStore.userInfo.refresh_token = newToken.refresh_token
//                 localStorage.setItem('userInfo', JSON.stringify({token: newToken.access_token, refresh_token: newToken.refresh_token}))
//                 return axios(originalRequest)
//             })
//         } catch (error) {
//             console.log('Ошибка при обновлении токена:', error)
//             localStorage.removeItem('userInfo')
//             router.push('/signIn')
//             authStore.userInfo.token = ''
//             authStore.userInfo.refresh_token = ''
//         }
//     }
// })