<script setup>
import {useAuthStore} from "@/stores/auth.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const studentStore = useStudentStore()
const authStore = useAuthStore()
const classroomName = ref('')
const router = useRouter()
const isLoading = ref(true)

onMounted(async () => {
  try {
    if (studentStore.classroomId) {
      const response = await axios.get('classrooms/' + studentStore.classroomId)
      classroomName.value = response.data.name
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error)
  } finally {
    isLoading.value = false
  }
})

const logOut = () => {
  localStorage.removeItem('userInfo')
  authStore.logOut()
  router.push('/signIn');
}

const Role = {
  ADMIN: 'Администратор',
  TEACHER: 'Преподаватель',
  STUDENT: 'Ученик'
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between mb-2">
      <h1 tabindex="0">{{ `${studentStore.lastName} ${studentStore.firstName} ${studentStore.patronymic ? studentStore.patronymic : ''}` }}</h1>
      <button @click="logOut" class="my-button w-auto">Выйти</button>
    </div>
    <div class="my-3">
      <div class="space-y-3" role="list">
        <div role="listitem">
          <span class="text-gray-500">Роль</span>
          <p>{{ Role[authStore.userInfo.role] }}</p>
        </div>
        <div v-if="studentStore.classroomId" role="listitem">
          <span class="text-gray-500">Учебная группа</span>
          <p>{{ classroomName }}</p>
        </div>
      </div>
    </div>
    <div v-if="authStore.userInfo.role === 'ADMIN'" class="flex flex-col gap-2 lg:flex-row">
      <a href="https://multiznaika-education.ru:9090" target="_blank" class="my-button bg-tableColor">Метрики Prometheus</a>
      <a href="https://multiznaika-education.ru:3000" target="_blank" class="my-button bg-tableColor">Дашборды Grafana</a>
    </div>
  </div>
</template>
