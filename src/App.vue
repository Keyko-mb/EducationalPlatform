<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/UI/Navbar.vue'
import {useAuthStore} from "@/stores/auth.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import Toast from 'primevue/toast';
import {useToast} from "primevue";
import {initializeToastInterceptor} from "@/api.js";
import {onMounted} from "vue";

const authStore = useAuthStore()

const checkAuth = async () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfo) {
    authStore.userInfo.id = userInfo.id
    authStore.userInfo.role = userInfo.role
    authStore.userInfo.token = userInfo.token
    authStore.userInfo.refresh_token = userInfo.refresh_token

    const studentStore = useStudentStore()
    await studentStore.initStudent()
  }
}

const toast = useToast();
onMounted(() => {
  initializeToastInterceptor(toast);
});

checkAuth();
</script>

<template>
<div id="app">
  <a href="#main-content" class="skip-link">Перейти к основному контенту</a>
  <Navbar />
  <main id="main-content">
    <div class="container mx-auto my-5">
      <RouterView/>
      <Toast/>
    </div>
  </main>
</div>
</template>