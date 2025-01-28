<script setup>
import {defineEmits, ref} from "vue";

const props = defineProps(['person'])
const person = ref({ ...props.person });
const emit = defineEmits(['savePersonData'])

const emitPersonData = () => {
  emit('savePersonData', person.value)
}

</script>

<template>
  <form @submit.prevent="emitPersonData">
    <div class="my-5 space-y-5">
      <h1>Пользователь</h1>

      <div>
        <label for="firstName">Имя</label>
        <input class="my-input w-full" type="text" id="firstName" v-model="person.firstName" aria-label="Поле для ввода имени пользователя">
      </div>
      <div>
        <label for="lastName">Фамилия</label>
        <input class="my-input w-full" type="text" id="lastName" v-model="person.lastName" aria-label="Поле для ввода фамилии пользователя">
      </div>
      <div>
        <label for="patronymic">Отчество</label>
        <input  class="my-input w-full" type="text" id="patronymic" v-model="person.patronymic" aria-label="Поле для ввода отчества пользователя">
      </div>
      <div>
        <label for="role">Роль</label>
        <select class="my-select w-full" id="role" v-model="person.role" aria-describedby="status-help">
          <option disabled value="">Выберите роль</option>
          <option value="STUDENT">Ученик</option>
          <option value="TEACHER">Преподаватель</option>
          <option value="ADMIN">Администратор</option>
        </select>
        <p id="status-help" class="sr-only">Используйте стрелки для выбора роли, затем нажмите Enter.</p>
      </div>
    </div>

    <button type="submit" class="my-button mt-5" aria-label="Сохранить данные пользователя">Сохранить</button>

  </form>
</template>

<style scoped>

</style>