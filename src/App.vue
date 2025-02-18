<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/UI/Navbar.vue'
import Breadcrumbs from './components/UI/Breadcrumbs.vue'
import {useAuthStore} from "@/stores/auth.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import {initializeToastInterceptor} from "@/api.js";
import {onMounted} from "vue";
import Footer from "@/components/UI/Footer.vue";

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

onMounted(() => {
  initializeToastInterceptor();
});

checkAuth();


</script>

<template>
  <div id="app" class="flex flex-col min-h-screen">
    <a href="#main-content" class="skip-link">Перейти к основному контенту</a>
    <Navbar />
    <main id="main-content" class="flex-grow">
      <div class="container px-5 mx-auto my-5">
        <Breadcrumbs />
        <RouterView v-slot="{ Component, route }">
          <Transition name="global" mode="out-in">
            <!-- Используем ключ, чтобы Vue знал, когда нужно анимировать смену компонента -->
            <Component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style>
.global-enter-active,
.global-leave-active {
  transition: opacity 0.3s;
}
.global-enter-from,
.global-leave-to {
  opacity: 0;
}
.global-enter-to,
.global-leave-from {
  opacity: 1;
}
</style>