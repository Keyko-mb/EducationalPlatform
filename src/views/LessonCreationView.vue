<script setup>

import LessonForm from "@/components/Forms/LessonForm.vue";
import axios from "axios";

const createLesson = (lesson) => {
  axios
      .post("lessons", lesson)
}
</script>

<template>
  <div>
    <h1>Новый урок</h1>
    <LessonForm
        @saveLessonData="createLesson"/>
  </div>
</template>