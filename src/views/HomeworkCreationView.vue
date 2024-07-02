<script setup>

import HomeworkForm from "@/components/Forms/HomeworkForm.vue";
import axios from "axios";

const createHomework = (homework) => {
  axios
      .post("homeworks", homework)
}
</script>

<template>
  <div>
    <h1>Новый урок</h1>
    <homeworkForm
        @saveHomeworkData="createHomework"/>
  </div>
</template>