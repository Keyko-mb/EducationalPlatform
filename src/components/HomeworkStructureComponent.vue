<script setup>
import {useHomeworkStore} from "@/stores/homework.js";
import {computed} from "vue";

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
</script>

<template>
  <div v-if="homework">
    <div class="flex justify-between">
      <h1>{{ homework.name }}</h1>
    </div>
    <div class="my-5">
      <h3>{{ homework.description }}</h3>
      <p>{{  homework.text }}</p>
      <!--          <p v-if="homework.attachment">Вложение: <a :href="homework.attachment">Скачать</a></p>-->
    </div>
  </div>
</template>

<style scoped>

</style>