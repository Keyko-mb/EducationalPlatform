<script setup>
import {useHomeworkStore} from "@/stores/homework.js";
import {computed} from "vue";
import Files from "@/components/UI/Files.vue";

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
</script>

<template>
  <div v-if="homework">
      <h1>{{ homework.name }}</h1>
    <div class="my-5 space-y-2">
      <h3>{{ homework.description }}</h3>
      <p>{{  homework.text }}</p>
      <div v-if="homework.attachments &&homework.attachments.length > 0">
        <h3 class="mb-2">Вложения</h3>
        <Files/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>