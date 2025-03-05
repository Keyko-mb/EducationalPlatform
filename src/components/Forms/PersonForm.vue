<script setup>
import {defineEmits, watch} from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps(['person'])
const emit = defineEmits(['savePersonData'])

const schema = yup.object({
  firstName: yup.string()
      .min(2, "Имя должно содержать от 2 символов")
      .max(50,"Имя должно содержать до 50 символов")
      .required("Имя не должно быть пустым")
      .matches(/^[а-яА-ЯёЁйЙ\-\s]+$/, "Имя может содержать только кириллицу, пробел и дефис"),
  lastName: yup.string()
      .min(2, "Фамилия должна содержать от 2 символов")
      .max(50,"Фамилия должна содержать до 50 символов")
      .required("Фамилия не должна быть пустой")
      .matches(/^[а-яА-ЯёЁйЙ\-\s]+$/, "Фамилия может содержать только кириллицу, пробел и дефис"),
  patronymic: yup.string()
      .max(50,"Отчество должно содержать до 50 символов")
      .matches(/^[а-яА-ЯёЁйЙ\-\s]*$/, "Отчество может содержать только кириллицу, пробел и дефис")
      .nullable(),
  role: yup.string()
      .required("Роль пользователя обязательна"),
});

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.person
});

const [firstNameField, firstNameAttrs] = defineField('firstName');
const [lastNameField, lastNameAttrs] = defineField('lastName');
const [patronymicField, patronymicAttrs] = defineField('patronymic');
const [roleField, roleAttrs] = defineField('role');

watch(() => props.person, (newValue) => {
  resetForm({ values: newValue });
});

const emitPersonData = handleSubmit((values) => {
  emit('savePersonData', values)
})

</script>

<template>
  <form @submit.prevent="emitPersonData">
    <div>
      <h1>Пользователь</h1>
      <div class="mt-5 mb-3">
        <label for="firstName">Имя</label>
        <input class="my-input w-full" type="text" id="firstName" v-model="firstNameField"
               v-bind="firstNameAttrs" aria-label="Поле для ввода имени пользователя"
               placeholder="Введите имя пользователя">
        <p v-if="errors.firstName" class="error">{{ errors.firstName }}</p>
      </div>
      <div class="mb-3">
        <label for="lastName">Фамилия</label>
        <input class="my-input w-full" type="text" id="lastName" v-model="lastNameField"
               v-bind="lastNameAttrs" aria-label="Поле для ввода фамилии пользователя"
               placeholder="Введите фамилию пользователя">
        <p v-if="errors.lastName" class="error">{{ errors.lastName }}</p>
      </div>
      <div class="mb-3">
        <label for="patronymic">Отчество</label>
        <input  class="my-input w-full" type="text" id="patronymic" v-model="patronymicField"
                v-bind="patronymicAttrs" aria-label="Поле для ввода отчества пользователя"
                placeholder="Введите отчество пользователя (при наличии)">
        <p v-if="errors.patronymic" class="error">{{ errors.patronymic }}</p>
      </div>
      <div class="mb-3">
        <label for="role">Роль</label>
        <select class="my-select w-full" id="role" v-model="roleField"
                v-bind="roleAttrs" aria-describedby="status-help">
          <option value="" selected disabled>Выберите роль</option>
          <option value="STUDENT">Ученик</option>
          <option value="TEACHER">Преподаватель</option>
          <option value="ADMIN">Администратор</option>
        </select>
        <p id="status-help" class="sr-only">Используйте стрелки для выбора роли, затем нажмите Enter.</p>
        <p v-if="errors.role" class="error">{{ errors.role }}</p>
      </div>
    </div>

    <button type="submit" class="my-button mt-5" aria-label="Сохранить данные пользователя">Сохранить</button>

  </form>
</template>

<style scoped>

</style>