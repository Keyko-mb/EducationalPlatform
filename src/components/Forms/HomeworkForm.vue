<script setup>
import {defineEmits, defineProps, ref} from "vue";
import {useFilesStore} from "@/stores/files.js";

const props = defineProps(['homework'])
const homework = ref({ ...props.homework });
const emit = defineEmits(['saveHomeworkData'])
const filesStore = useFilesStore();
const files = ref(filesStore.decodedFiles);
const newFiles = ref([]);
const fileInput = ref(null);
const isSaved = ref(false)

const emitHomeworkData = () => {
  emit('saveHomeworkData', homework.value, newFiles.value)
  isSaved.value = true
  if (fileInput.value) {
    fileInput.value.value = "";
    newFiles.value = [];
  }
}

const handleFileUpload = (event) => {
  newFiles.value = Array.from(event.target.files);
}

const removeFile = (file) => {
  try {
    filesStore.deleteFile('homeworks', homework.value.id, file.name);
    files.value = Object.values(files.value).filter(f => f.name !== file.name);
    homework.value.attachments = homework.value.attachments.filter(f => f !== file.name);
    filesStore.refreshFiles();
  } catch (error) {
    console.error('Ошибка при удалении вложения:', error);
  }
}
</script>

<template>
  <div>
    <div>
      <h1>Урок</h1>
      <div class="my-5">
        <label for="name">Название</label>
        <input class="my-input w-full" type="text" id="name" v-model="homework.name">
      </div>
      <div class="mb-3">
        <label for="description">Описание</label>
        <textarea class="my-input w-full min-h-52" type="text" id="description" v-model="homework.description"/>
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
        <label for="access" class="form-label">Текст</label>
        <div class="flex gap-1">
          <input type="checkbox" id="access" v-model="homework.access"/>
          <p>Доступно ученикам</p>
        </div>
      </div>
    </div>
    <div class="flex gap-5 items-center mt-5">
      <button class="my-button" @click="emitHomeworkData">Сохранить</button>
      <p v-if="isSaved">Изменения сохранены</p>
    </div>
  </div>
</template>

<style scoped>

</style>