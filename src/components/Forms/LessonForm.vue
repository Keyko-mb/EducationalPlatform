<script setup>
import {defineEmits, h, ref, watch} from "vue";
import {useFilesStore} from "@/stores/files.js";

import {useForm} from "vee-validate";
import * as yup from "yup";
import ToastMessage from "@/components/UI/ToastMessage.vue";
import {useToast} from "vue-toastification";

const props = defineProps(['lesson'])
const emit = defineEmits(['saveLessonData'])
const filesStore = useFilesStore();
const files = ref(filesStore.decodedFiles);
const newFiles = ref([]);
const removedFiles = ref([]);

const toast = useToast();

const schema = yup.object({
  name: yup.string()
      .min(2, "Название урока должно содержать от 2 символов")
      .max(150, "Название урока должно содержать до 150 символов")
      .required("Название урока не может быть пустым"),
  content: yup.string()
      .max(5000, "Содержимое урока не должно превышать 5000 символов")
      .nullable(),
  attachments: yup.array(),
  description: yup.string()
      .max(5000, "Описание урока не должно превышать 5000 символов")
      .nullable(),
  access: yup.boolean()
});

const {handleSubmit, errors, defineField, resetForm, setFieldValue} = useForm({
  validationSchema: schema,
  initialValues: props.lesson
});

const [nameField, nameAttrs] = defineField('name');
const [descriptionField, descriptionAttrs] = defineField('description');
const [contentField, contentAttrs] = defineField('content');
const [accessField, accessAttrs] = defineField('access');

watch(() => props.lesson, (newValue) => {
  resetForm({values: newValue});
});

const emitLessonData = handleSubmit(async (values) => {
  if (!values.access) {
    values.access = false
  }
  if (values.id) {
    for (const file of removedFiles.value) {
      await filesStore.deleteFile('lessons', values.id, file.name);
      values.attachments = values.attachments.filter(f => f !== file.name);
    }
    for (const file of newFiles.value) {
      const filename = await filesStore.uploadFile('lessons', values.id, file);
      if (filename) {
        await filesStore.fetchFile('lessons', values.id, filename);
        values.attachments.push(filename);
      }
    }
    setFieldValue("attachments", values.attachments);

    filesStore.refreshFiles();
  }
  emit('saveLessonData', values, newFiles.value);
  newFiles.value = [];
  removedFiles.value = [];
});

const handleFileUpload = (event) => {
  const MAX_FILE_SIZE = 10485760; // 10 МБ
  const filesArray = Array.from(event.target.files);
  const validFiles = [];
  let hasOversizedFiles = false;

  for (const file of filesArray) {
    if (file.size > MAX_FILE_SIZE) {
      const toastContent = h(ToastMessage, {
        message: "Ошибка загрузки",
        details: { info: `Файл ${file.name} превышает допустимый размер (10 МБ)` }
      });
      toast.error(toastContent);
      hasOversizedFiles = true;
    } else {
      validFiles.push(file);
    }
  }
  if (hasOversizedFiles) {
    event.target.value = '';
  }
  newFiles.value = validFiles;
}

const removeFile = async (file) => {
  try {
    files.value = files.value.filter(f => f.name !== file.name);
    removedFiles.value.push(file);
  } catch (error) {
    console.error('Ошибка при удалении вложения:', error);
  }
}
</script>

<template>
  <form @submit.prevent="emitLessonData" aria-labelledby="lesson-title">
    <div>
      <h1 id="lesson-title">Урок</h1>

      <fieldset aria-labelledby="basic-info">
        <legend id="basic-info" class="sr-only">Основная информация</legend>
        <div class="my-5">
          <label for="name">Название</label>
          <input class="my-input w-full" type="text" id="name" v-model="nameField"
                 v-bind="nameAttrs" aria-label="Поле для ввода названия урока"
                 placeholder="Введите название урока">
          <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>

        <div class="mb-3">
          <label for="description">Описание</label>
          <textarea class="my-input w-full min-h-32" id="description" v-model="descriptionField"
                    v-bind="descriptionAttrs" aria-label="Поле для ввода описания урока"
                    placeholder="Введите описание урока"/>
          <p v-if="errors.description" class="error">{{ errors.description }}</p>
        </div>

        <div class="mb-3">
          <label for="text">Текст</label>
          <textarea class="my-input w-full min-h-52" id="text" v-model="contentField"
                    v-bind="contentAttrs" aria-label="Поле для ввода текстового содержания урока"
                    placeholder="Введите содержание урока"/>
          <p v-if="errors.content" class="error">{{ errors.content }}</p>
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
              <img :src="file.url" :alt="file.name || 'Изображение без названия'" width="150" class="rounded-lg"/>
              <button
                  @click="removeFile(file)"
                  type="button"
                  class="absolute top-2 right-2 w-6 h-6 bg-errColor rounded-full px-1 hover:shadow-lg hover:opacity-100 opacity-80"
                  :aria-label='"Удалить изображение" + index + 1'
              >
                <img src="/delete.svg" alt="Удалить" class="w-6 h-6" role="presentation"/>
              </button>
            </div>

            <div v-else class="flex w-full px-2 py-1 rounded-lg border border-tertiary ">
              <a :href="file.url"
                 :download="'file-' + index"
                 class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ file.fileName }}</a>
              <button
                  @click="removeFile(file)"
                  type="button"
                  class="w-6 h-6 opacity-80 hover:opacity-100 mt-2 bg-errColor rounded-full px-1"
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
        <label for="new-attachments">Добавить вложения (размер файла не должен превышать 10 МБ):</label>
        <input type="file"
               multiple
               id="new-attachments"
               @change="handleFileUpload"
               ref="fileInput"
               class="my-file"
               aria-label="Выберите файлы для загрузки">
        <p v-if="errors.attachments" class="error">{{ errors.attachments }}</p>
      </fieldset>

      <fieldset class="my-5">
        <legend>Доступность</legend>
        <div class="flex gap-1">
          <input type="checkbox" id="access" v-model="accessField"
                 v-bind="accessAttrs"/>
          <label for="access">Доступно ученикам</label>
        </div>
      </fieldset>

    </div>

    <button type="submit" class="my-button mt-5">Сохранить</button>

  </form>
</template>