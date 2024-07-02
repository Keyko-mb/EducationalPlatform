<script setup>

import HomeworkForm from "@/components/Forms/HomeworkForm.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const homeworkId = useRoute().params.homeworkId

const homework = ref({})

onMounted(() => {
  axios.get(`homeworks/${homeworkId}`).then((response) => {
    homework.value = response.data
  })
})

const editHomework = (homework) => {
  axios
      .put(`homeworks/${homework.id}`, homework)
}
</script>

<template>
  <div>
    <h1>Редактировать урок</h1>
    <homeworkForm
        @savePersonData="editHomework"
        :homework="homework"/>
  </div>
</template>
