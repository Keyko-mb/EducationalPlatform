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
        <summary style=" font-size: 1.25em;"
                 role="button"
                 aria-expanded="true">
          {{props.classroom.name}}</summary>
        <table class="w-full rounded-lg overflow-hidden border-collapse shadow-md mt-2">
          <caption class="sr-only">
            Список студентов учебной группы {{ props.classroom.name }}
          </caption>
          <thead>
          <tr class="bg-tableColor bg-opacity-75 border border-tertiary">
            <th class="my-th" scope="col">Фамилия</th>
            <th class="my-th" scope="col">Имя</th>
            <th class="my-th" scope="col">Отчество</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in props.users" :key="user.id" class="bg-formColor" role="row">
            <td class="my-td border-l border-tertiary">{{ user.lastName }}</td>
            <td class="my-td">{{ user.firstName }}</td>
            <td class="my-td border-r border-tertiary">{{ user.patronymic }}</td>
          </tr>
          </tbody>
        </table>
      </details>
      <button
          @click="emitDeleteClassroom"
          class="cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"
          :aria-label='"Удалить учебную группу" + props.classroom.name'
      >
        <img src="/delete.svg" alt="" role="presentation"/>
      </button>
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