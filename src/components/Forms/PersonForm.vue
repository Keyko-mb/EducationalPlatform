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
<div>
  <div class="my-5 space-y-5">
    <div>
      <p>Имя</p>
      <input class="my-input" type="text" id="name" v-model="person.firstName">
    </div>
    <div>
      <p>Фамилия</p>
      <input  class="my-input" type="text" id="surname" v-model="person.lastName">
    </div>
    <div>
      <p>Отчество</p>
      <input  class="my-input" type="text" id="surname" v-model="person.patronymic">
    </div>
    <div>
      <p>Username</p>
      <input  class="my-input" type="email" id="email" v-model="person.username">
    </div>
    <div>
      <p>Роль</p>
      <select class="my-select" id="role" v-model="person.role">
        <option>Выберите роль</option>
        <option>STUDENT</option>
        <option>TEACHER</option>
        <option>ADMIN</option>
      </select>
    </div>
  </div>
  <div class="flex gap-5">
    <button class="my-button" @click="emitPersonData">Сохранить</button>
  </div>
</div>
</template>

<style scoped>

</style>