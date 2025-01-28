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
  <form @submit.prevent="emitLessonData" aria-labelledby="lesson-title">
    <div class="my-5">
      <h1 id="lesson-title">Урок</h1>

      <fieldset aria-labelledby="basic-info">
        <legend  id="basic-info" class="sr-only">Основная информация</legend>
        <div class="my-5">
          <label for="name">Название</label>
          <input class="my-input w-full" type="text" id="name" v-model="lesson.name" aria-label="Поле для ввода названия урока">
        </div>

        <div class="mb-3">
          <label for="description">Описание</label>
          <textarea  class="my-input w-full" id="description" v-model="lesson.description" aria-label="Поле для ввода описания урока"/>
        </div>

        <div class="mb-3">
          <label for="text">Текст</label>
          <textarea class="my-input w-full min-h-52" id="text" v-model="lesson.content" aria-label="Поле для ввода текстового содержания урока"/>
        </div>
      </fieldset>

      <fieldset v-if="files.length > 0" class="mb-3">
        <legend>Вложения</legend>

        <ul class="border rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4" id="attachments">
          <li
              v-for="(file, index) in files"
              :key="'file-' + index"
              class="flex items-center mb-2"
              role="listitem">
            <div v-if="file.type.startsWith('image')" class="relative">
              <img :src="file.url" :alt="file.name || 'Изображение без названия'" width="150" class="rounded-lg" />
              <button
                  @click="removeFile(file)"
                  type="button"
                  class="w-6 h-6 opacity-80 hover:opacity-100 mt-2 bg-errColor rounded-full p-1"
                  :aria-label='"Удалить изображение" + index + 1'
              >
                <img src="/delete.svg" alt="Удалить" class="w-6 h-6" role="presentation"/>
              </button>
            </div>

            <div v-else class="flex h-full w-full px-2 py-1 rounded-lg border border-tertiary ">
              <a :href="file.url"
                 :download="'file-' + index"
                 class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ index + 1 }}</a>
              <button
                  @click="removeFile(file)"
                  type="button"
                  class="w-6 h-6 opacity-80 hover:opacity-100 mt-2 bg-errColor rounded-full p-1"
                  :aria-label='"Удалить файл" + index + 1'
              >
                <img src="/delete.svg" alt="Удалить" class="w-6 h-6" role="presentation"/>
              </button>
            </div>
          </li>
        </ul>
      </fieldset>

      <fieldset>
        <legend class="sr-only">Добавление вложений</legend>
        <label for="new-attachments">Добавить вложения:</label>
        <input type="file"
               multiple
               id="new-attachments"
               @change="handleFileUpload"
               ref="fileInput"
               class="my-file"
               aria-label="Выберите файлы для загрузки">
      </fieldset>

      <fieldset class="my-5">
        <legend>Доступность</legend>
        <div class="flex gap-1">
          <input type="checkbox" id="access" v-model="lesson.access"/>
          <label for="access">Доступно ученикам</label>
        </div>
      </fieldset>

    </div>

    <button type="submit" class="my-button mt-5">Сохранить</button>

  </form>
</template>