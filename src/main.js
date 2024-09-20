import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './api.js'

// axios.defaults.baseURL = 'http://localhost:8084/v1/api/';

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
