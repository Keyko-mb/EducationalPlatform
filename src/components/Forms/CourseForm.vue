<script setup>
import {defineEmits, watch} from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps(['course'])
const emit = defineEmits(['saveCourseData'])

const schema = yup.object({
  name: yup.string()
      .min(3, "Название должно содержать от 2 символов")
      .max(150, "Название должно содержать до 150 символов")
      .required("Название не может быть пустым"),
  description: yup.string()
      .max(5000, "Описание должно содержать до 5000 символов")
      .nullable(),
  access: yup.boolean()
});

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.course
});

const [nameField, nameAttrs] = defineField("name");
const [descriptionField, descriptionAttrs] = defineField("description");
const [accessField, accessAttrs] = defineField('access');

watch(() => props.course, (newCourse) => {
  resetForm({ values: newCourse });
});

const emitCourseData = handleSubmit((values) => {
  if (!values.access) {
    values.access = false
  }
  emit("saveCourseData", values);
});

</script>

<template>
  <form @submit.prevent="emitCourseData">
    <div class="mt-2 space-y-2">
      <h1>Раздел</h1>
      <div>
        <label for="name">Название раздела</label>
        <input class="my-input w-full" type="text" id="name" v-model="nameField"
               v-bind="nameAttrs" aria-label="Поле для ввода названия раздела"
               placeholder="Введите название раздела">
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>
      <div>
        <label for="caption">Описание раздела</label>
        <textarea class="my-input w-full min-h-52" type="text" id="caption" v-model="descriptionField"
                  v-bind="descriptionAttrs" aria-label="Поле для ввода описания раздела"
                  placeholder="Введите описание раздела"/>
        <p v-if="errors.description" class="error">{{ errors.description }}</p>
      </div>
      <fieldset>
        <legend>Доступность</legend>
        <div class="flex gap-1">
          <input type="checkbox" id="access" v-model="accessField" v-bind="accessAttrs"/>
          <label for="access">Доступно ученикам</label>
        </div>
      </fieldset>

      <button class="my-button mt-5" type="submit">Сохранить</button>
    </div>
  </form>
</template>

<style scoped>

</style>