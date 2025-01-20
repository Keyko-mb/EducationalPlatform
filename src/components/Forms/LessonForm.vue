<script setup>
import {defineEmits, ref} from "vue";
import {useFilesStore} from "@/stores/files.js";

const props = defineProps(['lesson'])
const lesson =  ref({ ...props.lesson });
const emit = defineEmits(['saveLessonData'])
const filesStore = useFilesStore();
const files = ref(filesStore.decodedFiles);
const newFiles = ref([]);
const removedFiles = ref([]);

const emitLessonData = async () => {
  if (!lesson.value.access) {
    lesson.value.access = false
  }
  for (const file of removedFiles.value) {
    await filesStore.deleteFile('lessons', lesson.value.id, file.name);
    lesson.value.attachments = lesson.value.attachments.filter(f => f !== file.name);
  }
  for (const file of newFiles.value) {
    const filename = await filesStore.uploadFile('lessons', lesson.value.id, file);
    await filesStore.fetchFile('lessons', lesson.value.id, filename);
    lesson.value.attachments.push(filename);
  }
  filesStore.refreshFiles();
  emit('saveLessonData', lesson.value, newFiles.value);
  newFiles.value = [];
  removedFiles.value = [];
}

const handleFileUpload = (event) => {
  newFiles.value = Array.from(event.target.files);
}

const removeFile = (file) => {
  try {
    files.value = Object.values(files.value).filter(f => f.name !== file.name);
    removedFiles.value.push(file);
  } catch (error) {
      console.error('Ошибка при удалении вложения:', error);
  }
}

</script>

<template>
<div>
  <div class="my-5 space-y-2">
    <h1>Урок</h1>
    <div class="my-5">
      <label for="name" class="form-label">Название</label>
      <input class="my-input w-full" type="text" id="name" v-model="lesson.name">
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">Описание</label>
      <textarea  class="my-input w-full" type="text" id="description" v-model="lesson.description"/>
    </div>
    <div class="mb-3">
      <label for="text" class="form-label">Текст</label>
      <textarea class="my-input w-full min-h-52" type="text" id="text" v-model="lesson.content"/>
    </div>
    <div v-if="files.length > 0" class="mb-3">
      <label class="form-label" for="attachments">Вложения</label>
      <div class="border rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4" id="attachments">
        <div
            v-for="(file, index) in files"
            :key="'file-' + index"
            class="flex items-center mb-2">
          <div v-if="file.type.startsWith('image')" class="relative">
            <img :src="file.url" alt="Изображение" width="150" class="rounded-lg" />
            <input @click="removeFile(file)"
                   type="image"
                   alt="Удалить"
                   src='/delete.svg'
                   class="absolute top-2 right-2 w-6 h-6 bg-errColor rounded-full p-1 hover:shadow-lg hover:opacity-100 opacity-80"/>
          </div>

          <div v-else class="flex h-full w-full px-2 py-1 rounded-lg border border-tertiary ">
            <a :href="file.url"
               :download="'file-' + index"
               class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ index + 1 }}</a>
            <input @click="removeFile(file)"
                   type="image"
                   alt="Удалить"
                   src='/delete.svg'
                   class="w-6 h-6 opacity-80 hover:opacity-100 mt-2 bg-errColor rounded-full p-1"/>
          </div>
        </div>
      </div>
    </div>
    <div>
      <label for="new-attachments">Добавить вложения</label>
      <input type="file" multiple id="new-attachments"
             @change="handleFileUpload"
             ref="fileInput"
             class="my-file">
    </div>
    <div class="my-5">
      <label for="access" class="form-label">Доступность</label>
      <div class="flex gap-1">
        <input type="checkbox" id="access" v-model="lesson.access"/>
        <p>Доступно ученикам</p>
      </div>
    </div>
  </div>
  <div class="flex gap-5 items-center mt-5">
    <button class="my-button" @click="emitLessonData">Сохранить</button>
  </div>
</div>
</template>

<style scoped>

</style>