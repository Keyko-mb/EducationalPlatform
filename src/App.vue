<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/UI/Navbar.vue'
import {useAuthStore} from "@/stores/auth.js";
import {useStudentStore} from "@/stores/studentInfo.js";

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

checkAuth()

</script>

<template>
<main>
  <Navbar />
  <div class="container mx-auto my-5">
    <RouterView/>
  </div>
</main>
</template>
