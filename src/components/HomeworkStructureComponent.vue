<script setup>
import {useHomeworkStore} from "@/stores/homework.js";
import {computed} from "vue";
import Files from "@/components/UI/Files.vue";

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
</script>

<template>
  <div v-if="homework">
    <h1 tabindex="0">{{ homework.name }}</h1>
    <div class="my-5 space-y-2">
      <p tabindex="0">{{ homework.description }}</p>
      <div v-if="homework.attachments &&homework.attachments.length > 0">
        <h2 tabindex="0" class="mb-2">Вложения</h2>
        <Files/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>