<script setup>
import Card from '../components/UI/Card.vue'
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import CourseComponent from "@/components/CourseComponent.vue";
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

</script>

<template>
    <div>
      <div class="flex justify-between">
        <h1>{{curriculum.name}}</h1>
        <button class="my-button" @click="router.push(`/curricula/${curriculum.id}/settings`)">Настройки курса</button>
      </div>
      <p>{{ curriculum.description }}</p>
      <CourseComponent v-for="course in courses" :key="course.id" :course="course" />
    </div>
</template>