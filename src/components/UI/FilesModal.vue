<script setup>

import {useAnswerStore} from "@/stores/answer.js";
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
  answer: Object
})
const answerStore = useAnswerStore()
const files = ref(answerStore.decodedFiles);

onMounted(() => {
  if (props.answer && props.answer.attachments) {
    for (const file of props.answer.attachments) {
      answerStore.fetchFile(props.answer.id, file)
    }
    answerStore.refreshFiles();
  }
})

onUnmounted(() => {
  answerStore.clearAnswer();
});
</script>

<template>
  <h1 class="my-2">Вложения к ответу</h1>
  <div class="border rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4" id="attachments">
    <div
        v-for="(file, index) in files"
        :key="'file-' + index"
        class="flex items-center mb-2">
      <div v-if="file.type.startsWith('image')" class="relative">
        <img :src="file.url" alt="Изображение" class="rounded-lg max-w-80" />
      </div>

      <div v-else class="flex h-full w-full px-2 py-1 rounded-lg border border-tertiary ">
        <a :href="file.url"
           :download="'file-' + index"
           class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ index + 1 }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>