<script setup>
import {useFilesStore} from "@/stores/files.js";
import {computed} from "vue";
import {useAnswerStore} from "@/stores/answer.js";

const props = defineProps({
  flag: String
})
const filesStore = props.flag === 'answer' ? useAnswerStore() : useFilesStore();
const images = computed(() => filesStore.images);
const links = computed(() => filesStore.links);
</script>

<template>
  <div>
    <div v-if="images.length > 0" class="flex flex-wrap gap-4 ">
      <figure
          v-for="(file, index) in images"
          :key="'image-' + index"
          class="max-w-96 text-center">
        <img
            :src="file.url"
            :alt="file.name || 'Изображение без названия'"
            role="img"
            class="shadow-md"/>
      </figure>
    </div>

    <ul v-if="links.length > 0" class="flex flex-col gap-4 mt-4 items-start" role="list">
      <li
          v-for="(file, index) in links"
          :key="'link-' + index"
          class="text-center">
        <a :href="file.url"
           :download="'file-' + index"
           class="my-link"
           :aria-label="'Скачать файл номер ' + (index + 1)">
          Скачать файл {{ index + 1 }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>