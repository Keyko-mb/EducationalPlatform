<script setup lang="ts">
import {defineProps} from "vue";
const props = defineProps(["users", "classroom"]);

const emits = defineEmits(['deleteClassroom'])

const emitDeleteClassroom = () => {
  const classroomId = props.classroom.id
  emits('deleteClassroom', classroomId)
}

</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <h1>{{props.classroom.name}}</h1>
      <input @click="emitDeleteClassroom"
             type="image"
             alt="delete"
             src='/delete.svg'
             class="cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"/>
    </div>
    <table class="w-full border border-secondary bg-tertiary rounded-lg">
      <thead>
      <tr>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in props.users" :key="user.id">
        <td>{{ user.lastName }}</td>
        <td>{{ user.firstName }}</td>
        <td>{{ user.patronymic }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<style>
th, td {
  padding: 10px;
  text-align: center;
  @apply border-b border-secondary;
}
</style>