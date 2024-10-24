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
    <div class="flex items-start gap-2">
      <details class="w-full" open>
        <summary style=" font-size: 1.25em;">{{props.classroom.name}}</summary>
        <table class="w-full border border-secondary bg-tertiary rounded-lg m-2">
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
      </details>
      <input @click="emitDeleteClassroom"
             type="image"
             alt="delete"
             src='/delete.svg'
             class="cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"/>
    </div>
  </div>
</template>


<style>
th, td {
  padding: 10px;
  text-align: center;
  @apply border-b border-secondary;
}
</style>