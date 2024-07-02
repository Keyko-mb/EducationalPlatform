<script setup>

import LessonForm from "@/components/Forms/LessonForm.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const lessonId = useRoute().params.lessonId

const lesson = ref({})

onMounted(() => {
  axios.get(`lessons/${lessonId}`).then((response) => {
    lesson.value = response.data
  })
})

const editLesson = (lesson) => {
  axios
      .put(`lessons/${lesson.id}`, lesson)
}
</script>

<template>
  <div>
    <h1>Редактировать урок</h1>
    <LessonForm
        @savePersonData="editLesson"
        :lesson="lesson"/>
  </div>
</template>
