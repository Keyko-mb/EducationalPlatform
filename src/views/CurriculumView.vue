<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import CourseComponent from "@/components/CourseComponent.vue";
import router from "@/router/index.js";
import {useAuthStore} from "@/stores/auth.js";

const authStore = useAuthStore()
const curriculum = ref({})
const courses = ref([])

const id = useRoute().params.id

onMounted (() => {
  axios.get(`curricula/${id}`).then((response) => {
    curriculum.value = response.data
  })
  axios.get(`curricula/${id}/courses`).then((response) => {
    courses.value = response.data
  })
})

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    if (authStore.userInfo.role === 'STUDENT') {
      return course.access;
    }
    return true;
  });
});

</script>

<template>
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-logoColor">{{curriculum.name}}</h1>
      <p>{{ curriculum.description }}</p>
      <p v-if="!curriculum.access" class="access" aria-label="Статус программы: скрыто">Скрыто</p>
    </div>
    <button v-if="authStore.userInfo.role === 'ADMIN' || authStore.userInfo.role === 'TEACHER'"
            class="my-button h-1/2"
            @click="router.push(`/curricula/${curriculum.id}/settings`)">Настройки курса</button>
  </div>
  <div role="list">
    <CourseComponent v-for="course in filteredCourses"
                     :key="course.id"
                     :course="course"
                     role="listitem"/>
  </div>
</template>