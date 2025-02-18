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
    <div v-if="images.length > 0" class="flex flex-wrap gap-4">
      <h2 class="sr-only">Прикрепленные изображения</h2>
      <figure
          v-for="(file, index) in images"
          :key="'image-' + index"
          class="max-w-96 text-center"
          aria-labelledby="image-{{index}}">
        <img
            :src="file.url"
            :alt="file.name || 'Изображение без названия'"
            class="shadow-md"/>
<!--            loading="lazy"-->
<!--            decoding="async"/>-->
        <figcaption
            id="image-{{index}}"
            class="sr-only"
        >
          Изображение {{index + 1}}: {{file.fileName || 'Без названия'}}
        </figcaption>
      </figure>
    </div>

    <div
        v-if="links.length > 0"
        class="mt-4 py-1 overflow-auto">
      <h2 class="sr-only">Прикрепленные файлы</h2>
      <ul class="flex flex-wrap lg:flex-col gap-4 items-start">
        <li
            v-for="(file, index) in links"
            :key="'link-' + index"
            class="lg:text-center text-nowrap"
            role="listitem">
          <a :href="file.url"
             :download="file.fileName"
             class="my-link">
            Скачать файл {{ file.fileName }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>