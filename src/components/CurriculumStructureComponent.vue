<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import CourseStructureComponent from "@/components/CourseStructureComponent.vue";
import Dialog from "@/components/UI/Dialog.vue";
import CourseForm from "@/components/Forms/CourseForm.vue";

const curriculum = ref({})
const courses = ref([])

const id = useRoute().params.id
const addCourseDialogVisible = ref(false)

onMounted (() => {
  axios.get(`curricula/${id}`).then((response) => {
    curriculum.value = response.data
  })
  axios.get(`curricula/${id}/courses`).then((response) => {
    courses.value = response.data
  })
})

const addCourse = (course) => {
  course.curriculumId = curriculum.value.id
  axios
      .post("courses", course)
      .then((response) => {
        courses.value.push(response.data)
        axios
            .put(`courses/${response.data.id}/curriculum/${curriculum.value.id}`)
      })
  addCourseDialogVisible.value = false;
}

const deleteCourse = (courseId) => {
  axios.delete(`courses/${courseId}`)
      .then(() => {
        courses.value = courses.value.filter(course => course.id !== courseId)
      })
}

const showCourseAddDialog = () => {
  addCourseDialogVisible.value = true;
}

</script>

<template>
  <div>
    <h1>{{curriculum.name}}</h1>
    <p>{{ curriculum.description }}</p>
    <CourseStructureComponent v-for="course in courses"
                              :key="course.id"
                              :course="course"
                              @deleteClick="deleteCourse"
                              role="listitem"/>
    <button class="my-button mt-2" @click="showCourseAddDialog" aria-controls="add-course-dialog">Добавить раздел</button>
    <Dialog v-model:show="addCourseDialogVisible"
            aria-labelledby="dialog-title" >
      <h2 id="dialog-title" class="sr-only">Окно для создания нового раздела учебной программы</h2>
      <CourseForm @saveCourseData="addCourse"/>
    </Dialog>
  </div>
</template>