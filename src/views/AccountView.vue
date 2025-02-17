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
onMounted(() => {
  if (studentStore.classroomId) {
    axios
        .get('classrooms/' + studentStore.classroomId)
        .then((response) => {
          classroomName.value = response.data.name
        })
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
      <h1>{{`${studentStore.lastName} ${studentStore.firstName} ${studentStore.patronymic}`}}</h1>
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
      <button @click="logOut" class="my-button w-auto">Выйти</button>
    </div>
</template>