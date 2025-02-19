import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue'
import router from './router'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
app.use(Toast, {
    transition: "Vue-Toastification__fade",
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: false,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
});
app.use(router)

app.mount('#app')
import './api.js'
