<script setup lang="ts">
import {defineProps, ref} from "vue";
import EditAndDeleteButtons from "@/components/UI/EditAndDeleteButtons.vue";
import Dialog from "@/components/UI/Dialog.vue";
import ClassroomForm from "@/components/Forms/ClassroomForm.vue";
import axios from "axios";

const props = defineProps(["classroom"]);
const emits = defineEmits(['deleteClassroom', 'editClassroom'])

const selectedClassroom = ref(null)
const editClassroomDialogVisible = ref(false)

const emitDeleteClassroom = () => {
  const classroomId = props.classroom.id
  emits('deleteClassroom', classroomId)
}

const emitEditClassroom = (updatedClassroom) => {

  const originalPeople = props.classroom.persons || [];
  const newPeople = updatedClassroom.persons || [];

  const peopleToDelete = originalPeople.filter(
      person => !newPeople.some(p => p.id === person.id)
  );

  const peopleToAdd = newPeople.filter(
      person => !originalPeople.some(p => p.id === person.id)
  );

  for (const student of peopleToDelete) {
    axios
        .delete(`classrooms/${updatedClassroom.id}/students/${student.id}`);
  }

  for (const student of peopleToAdd) {
    axios
        .put(`classrooms/${updatedClassroom.id}/students/${student.id}`);
  }

  emits('editClassroom', updatedClassroom)
  editClassroomDialogVisible.value = false;
}

const showClassroomEditDialog = (classroom) => {
  selectedClassroom.value = { ...classroom }
  editClassroomDialogVisible.value = true;
}

</script>

<template>
  <div class="flex items-start gap-2 mb-5">
      <details class="w-full" open>
        <summary style=" font-size: 1.25em;">{{props.classroom.name}}</summary>
<!--        <p v-for="person in props.classroom.persons">{{ person.lastName + ' ' + person.firstName + ' ' + person.patronymic }}</p>-->
        <table v-if="props.classroom.persons.length > 0" class="w-full rounded-lg overflow-hidden border-collapse shadow-md mt-2">
          <thead>
          <tr class="bg-tableColor border border-tertiary bg-opacity-75 ">
            <th class="my-th">Фамилия</th>
            <th class="my-th">Имя</th>
            <th class="my-th">Отчество</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="person in props.classroom.persons" :key="person.id" class="bg-formColor">
            <td class="my-td border-l border-tertiary">{{ person.lastName }}</td>
            <td class="my-td">{{ person.firstName }}</td>
            <td class="my-td border-r border-tertiary">{{ person.patronymic }}</td>
          </tr>
          </tbody>
        </table>
        <p class="mt-2" v-else>Группа пуста</p>
      </details>
    <EditAndDeleteButtons @deleteClick="emitDeleteClassroom" @editClick="showClassroomEditDialog(classroom)" class="mt-1"/>
  </div>
  <Dialog v-model:show="editClassroomDialogVisible">
    <h1>Редактирование группы</h1>
    <ClassroomForm v-if="selectedClassroom" :classroom="selectedClassroom" @saveClassroomData="emitEditClassroom"/>
  </Dialog>
</template>


<style>
th, td {
  padding: 10px;
  text-align: center;
  @apply border-b border-secondary;
}
</style>