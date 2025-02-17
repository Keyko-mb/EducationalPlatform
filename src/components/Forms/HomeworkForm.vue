<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import {useFilesStore} from "@/stores/files.js";

import { useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps(['homework'])
const emit = defineEmits(['saveHomeworkData'])
const filesStore = useFilesStore();
const files = ref(filesStore.decodedFiles);
const newFiles = ref([]);
const fileInput = ref(null);
const removedFiles = ref([]);
const isSaved = ref(false);

const schema = yup.object({
  name: yup
      .string()
      .min(2, "Название должно содержать от 2 символов")
      .max(150, "Название должно содержать до 150 символов")
      .required("Название не может быть пустым"),
  description: yup
      .string()
      .max(5000, "Описание не должно превышать 5000 символов")
      .nullable(),
  attachments: yup.array(),
  access: yup.boolean(),
});

const { handleSubmit, errors, resetForm, defineField, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: props.homework,
});

const [nameField, nameAttrs] = defineField("name");
const [descriptionField, descriptionAttrs] = defineField("description");
const [accessField, accessAttrs] = defineField("access");

watch(() => props.homework, (newValue) => {
  resetForm({ values: newValue });
});

const emitHomeworkData = handleSubmit(async (values) => {
  if (!values.access) {
    values.access = false
  }
  if (values.id) {
    for (const file of removedFiles.value) {
      await filesStore.deleteFile('homeworks', values.id, file.name);
      values.attachments = values.attachments.filter(f => f !== file.name);
    }
    for (const file of newFiles.value) {
      const filename = await filesStore.uploadFile('homeworks', values.id, file);
      if (filename) {
        await filesStore.fetchFile('homeworks', values.id, filename);
        values.attachments.push(filename);
      }
    }
    setFieldValue("attachments", values.attachments);

    filesStore.refreshFiles();
  }
  emit('saveHomeworkData', values, newFiles.value)
  fileInput.value.value = "";
  newFiles.value = [];
  removedFiles.value = [];
  isSaved.value = true;
  setTimeout(() => {
    isSaved.value = false;
  }, 3000);
})

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
  <form @submit.prevent="emitHomeworkData">
    <div>
      <h1 >Домашнее задание</h1>

      <div class="my-5">
        <label for="name">Название</label>
        <input class="my-input w-full" type="text" id="name" v-model="nameField"
               v-bind="nameAttrs" aria-label="Поле для ввода названия домашнего задания"
               placeholder="Введите название домашнего задания">
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>
      <div class="mb-3">
        <label for="description">Описание</label>
        <textarea class="my-input w-full min-h-52" type="text" id="description" v-model="descriptionField"
                  v-bind="descriptionAttrs"  aria-label="Поле для ввода описания урока"
                  placeholder="Введите описание задания"/>
      </div>
      <div v-if="files.length > 0" class="mb-3">
        <h2 >Вложения</h2>
        <ul class="border rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4">
          <li
              v-for="(file, index) in files"
              :key="'file-' + index"
              class="flex items-center mb-2"
              role="listitem"
          >
            <div v-if="file.type.startsWith('image')" class="relative">
              <img :src="file.url" :alt="'Изображение ' + (index + 1)"  width="150" class="rounded-lg" />
              <button
                  @click="removeFile(file)"
                  type="button"
                  class="absolute top-2 right-2 w-6 h-6 bg-errColor rounded-full px-1 hover:shadow-lg hover:opacity-100 opacity-80"
                  :aria-label='"Удалить изображение" + (index + 1)'
              >
                <img src="/delete.svg" alt="" class="w-6 h-6" role="presentation" />
              </button>
            </div>

            <div v-else class="flex h-full w-full px-2 py-1 rounded-lg border border-tertiary ">
              <a :href="file.url"
                 :download="file.fileName"
                 class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ file.fileName }}</a>
              <button
                  @click="removeFile(file)"
                  type="button"
                  class="w-6 h-6 opacity-80 hover:opacity-100 mt-2 bg-errColor rounded-full px-1"
                  :aria-label='"Удалить файл" + (file.fileName)'
              >
                <img src="/delete.svg" alt="" class="w-6 h-6" role="presentation"/>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <label for="new-attachments">Добавить вложения:</label>
        <input type="file" multiple id="new-attachments"
               @change="handleFileUpload"
               ref="fileInput"
               class="my-file"
               aria-label="Выберите файлы для загрузки">
        <p v-if="errors.attachments" class="error">{{ errors.attachments }}</p>
      </div>
      <fieldset class="my-5">
        <legend>Доступность</legend>
        <div class="flex gap-1">
          <input type="checkbox" id="access" v-model="accessField"
                 v-bind="accessAttrs"/>
          <label for="access">Доступно ученикам</label>
        </div>
      </fieldset>
    </div>
    <div class="flex gap-5 items-center mt-5">
      <button class="my-button active:bg-tertiary" type="submit">Сохранить</button>
      <p v-if="isSaved" class="opacity-80" aria-live="polite">Изменения сохранены</p>
    </div>
  </form>
</template>

<style scoped>

</style>