<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import CourseStructureComponent from "@/components/CourseStructureComponent.vue";
import router from "@/router/index.js";

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

const deleteCourse = (id) => {
  axios.delete(`courses/${id}`)
  courses.value.filter(course => course.id !== id)
}

</script>

<template>
  <div>
    <h1>{{curriculum.name}}</h1>
    <p>{{ curriculum.description }}</p>
    <CourseStructureComponent v-for="course in courses" :key="course.id" :course="course" @deleteClick="deleteCourse" />
    <button class="my-button mt-2" @click="router.push(`/curricula/${curriculum.id}/settings/courses/create`)">Добавить раздел</button>
  </div>
</template>