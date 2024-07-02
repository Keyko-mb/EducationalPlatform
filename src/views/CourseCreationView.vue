<script setup>
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import CourseForm from "@/components/Forms/CourseForm.vue";

const router = useRouter()
const route = useRoute();
const currentCurriculumId = route.params.curriculumId

const createCourse = (course) => {
  course.curriculum_id = currentCurriculumId
  console.log(course)
  axios
      .post("courses", course)
  router.push(`/curricula/${currentCurriculumId}/settings`)
}
</script>

<template>
  <div>
    <h1>Создание раздела</h1>
    <CourseForm
        @saveCourseData="createCourse"/>
  </div>
</template>

<style scoped>

</style>