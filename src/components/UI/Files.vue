<script setup>
import {useFilesStore} from "@/stores/files.js";
import {computed} from "vue";

const filesStore = useFilesStore();
const images = computed(() => filesStore.images);
const links = computed(() => filesStore.links);
</script>

<template>
  <div>
    <div v-if="images.length > 0" class="flex flex-wrap gap-4 ">
      <div
          v-for="(file, index) in images"
          :key="'image-' + index"
          class="max-w-60 text-center">
        <img :src="file.url" alt="Изображение" class="shadow-md"/>
      </div>
    </div>

    <div v-if="links.length > 0" class="flex flex-col gap-4 mt-4 items-start">
      <div
          v-for="(file, index) in links"
          :key="'link-' + index"
          class="text-center">
        <a :href="file.url"
           :download="'file-' + index"
           class="my-link">Скачать файл {{ index + 1 }}</a>
      </div>
    </div>

    <div v-if="!images.length && !links.length">
      Нет вложений
    </div>
  </div>
</template>

<style scoped>

</style>