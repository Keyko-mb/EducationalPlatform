<script setup lang="ts">
import {ref, toRef} from "vue";
import Dialog from "@/components/UI/Dialog.vue";
import PersonForm from "@/components/Forms/PersonForm.vue";
import EditAndDeleteButtons from "@/components/UI/EditAndDeleteButtons.vue";
import axios from "axios";

const props = defineProps(['people'])
const people = toRef(props, 'people');

const selectedPerson = ref(null)
const editPersonDialogVisible = ref(false)

const deletePerson = (id) => {
  axios.delete(`people/${id}`)
      .then(() => {
        const index = people.value.findIndex(person => person.id === id);
        if (index !== -1) {
          people.value.splice(index, 1);
        }
      })
}

const editPerson = (updatedPerson) => {
  axios
      .put(`people/${updatedPerson.id}`, updatedPerson)
      .then(() => {
        const index = people.value.findIndex(person => person.id === updatedPerson.id);
        if (index !== -1) {
          people.value[index] = { ...updatedPerson };
        }
      });
  editPersonDialogVisible.value = false;
}

const showPersonEditDialog = (person) => {
  selectedPerson.value = { ...person }
  editPersonDialogVisible.value = true;
}

</script>

<template>
  <table class="w-full rounded-lg overflow-hidden border-collapse shadow-md">
    <thead>
    <tr class="bg-tertiary bg-opacity-75 ">
      <th class="my-th">Фамилия</th>
      <th class="my-th">Имя</th>
      <th class="my-th">Отчество</th>
      <th class="my-th">Роль</th>
      <th class="my-th"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="person in props.people" :key="person.id" class="bg-formColor">
      <td class="my-td border-l border-tertiary">{{ person.lastName }}</td>
      <td class="my-td">{{ person.firstName }}</td>
      <td class="my-td">{{ person.patronymic }}</td>
      <td class="my-td">{{ person.role }}</td>
      <td class="my-td border-r border-tertiary">
        <EditAndDeleteButtons
            @deleteClick="deletePerson(person.id)"
            @editClick="showPersonEditDialog(person)"
        />
      </td>
    </tr>
    </tbody>
  </table>
  <Dialog v-model:show="editPersonDialogVisible">
    <h1>Редактирование пользователя</h1>
    <PersonForm v-if="selectedPerson" :person="selectedPerson" @savePersonData="editPerson"/>
  </Dialog>
</template>