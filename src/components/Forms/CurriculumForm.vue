<script setup>
import {defineProps, defineEmits, watch, ref} from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps(['curriculum']);
const emit = defineEmits(['saveCurriculumData']);
const isSaved = ref(false);

const schema = yup.object({
  name: yup.string()
      .min(2, "Название должно содержать от 2 символов")
      .max(150, "Название должно содержать до 150 символов")
      .required("Название не может быть пустым"),
  description: yup.string()
      .max(5000, "Описание не должно превышать 5000 символов")
      .nullable(),
  access: yup.boolean()
});

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.curriculum
});

const [nameField, nameAttrs] = defineField('name');
const [descriptionField, descriptionAttrs] = defineField('description');
const [accessField, accessAttrs] = defineField('access');

watch(() => props.curriculum, (newValue) => {
  resetForm({ values: newValue });
});

const emitCurriculumData = handleSubmit((values) => {
  emit('saveCurriculumData', values);
  isSaved.value = true;
  setTimeout(() => {
    isSaved.value = false;
  }, 3000);
});
</script>

<template>
  <form @submit.prevent="emitCurriculumData">
    <h1>Учебная программа</h1>
    <div class="my-5">
      <label for="name">Название программы</label>
      <input
          class="my-input w-full"
          type="text"
          id="name"
          v-model="nameField"
          v-bind="nameAttrs"
          aria-label="Поле для ввода названия учебной программы"
      >
      <p v-if="errors.name" class="error">{{ errors.name }}</p>
    </div>

    <div class="mb-3">
      <label for="caption">Описание программы</label>
      <textarea
          class="my-input w-full min-h-52"
          id="caption"
          v-model="descriptionField"
          v-bind="descriptionAttrs"
          aria-label="Поле для ввода описания учебной программы"
      />
      <p v-if="errors.description" class="error">{{ errors.description }}</p>
    </div>

    <fieldset class="mb-3">
      <legend>Доступность</legend>
      <div class="flex gap-1 items-center">
        <input
            type="checkbox"
            id="access"
            v-model="accessField"
            v-bind="accessAttrs"
            aria-label="Сделать доступной учебную программу"
        />
        <label for="access">Доступно ученикам</label>
      </div>
    </fieldset>

    <div class="flex gap-5 items-center mt-5">
      <button class="my-button active:bg-tertiary" type="submit">Сохранить</button>
      <p v-if="isSaved" class="opacity-80" aria-live="polite">Изменения сохранены</p>
    </div>
  </form>
</template>