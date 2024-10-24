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
  <div class="flex items-start gap-2">
      <details class="w-full" open>
        <summary style=" font-size: 1.25em;">{{props.classroom.name}}</summary>
<!--        <p v-for="person in props.classroom.persons">{{ person.lastName + ' ' + person.firstName + ' ' + person.patronymic }}</p>-->
        <table class="w-full border border-secondary bg-tertiary rounded-lg m-2">
          <thead>
          <tr>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="person in props.classroom.persons" :key="person.id">
            <td>{{ person.lastName }}</td>
            <td>{{ person.firstName }}</td>
            <td>{{ person.patronymic }}</td>
          </tr>
          </tbody>
        </table>
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