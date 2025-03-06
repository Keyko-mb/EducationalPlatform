<script setup>
import {h, ref, toRef} from "vue";
import Dialog from "@/components/UI/Dialog.vue";
import PersonForm from "@/components/Forms/PersonForm.vue";
import EditAndDeleteButtons from "@/components/UI/EditAndDeleteButtons.vue";
import axios from "axios";
import {useToast} from "vue-toastification";
import ToastMessage from "@/components/UI/ToastMessage.vue";
import {useAuthStore} from "@/stores/auth.js";

const props = defineProps(['people'])
const people = toRef(props, 'people');
const emit = defineEmits(['updatePeople'])

const selectedPerson = ref(null)
const editPersonDialogVisible = ref(false)
const authStore = useAuthStore();

const toast = useToast();

const deletePerson = (id) => {
  if (authStore.userInfo.id === id) {
    const toastContent = h(ToastMessage, {
      message: "Ошибка при удалении",
      details: { info: `Нельзя удалить самого себя :)` }
    });
    toast.error(toastContent);
  } else {
    axios.delete(`people/${id}`)
        .then(() => {
          const index = people.value.findIndex(person => person.id === id);
          if (index !== -1) {
            people.value.splice(index, 1);
          }
          emit('updatePeople', people.value);
        })
  }
}

const editPerson = (updatedPerson) => {
  axios
      .put(`people/${updatedPerson.id}`, updatedPerson)
      .then(() => {
        const index = people.value.findIndex(person => person.id === updatedPerson.id);
        if (index !== -1) {
          people.value[index] = { ...updatedPerson };
        }
        emit('updatePeople', people.value);
        if (authStore.userInfo.id === updatedPerson.id) {
          authStore.userInfo.role = updatedPerson.role
          localStorage.setItem('userInfo', JSON.stringify(authStore.userInfo));
        }
      });
  editPersonDialogVisible.value = false;
}

const showPersonEditDialog = (person) => {
  selectedPerson.value = { ...person }
  editPersonDialogVisible.value = true;
}

const Role = {
  ADMIN: 'Администратор',
  TEACHER: 'Преподаватель',
  STUDENT: 'Ученик'
}

</script>

<template>
  <div class="overflow-auto">
    <h2 class="sr-only">Список пользователей</h2>
    <table class="w-full rounded-lg overflow-hidden border-collapse shadow-md">
      <thead>
      <tr class="bg-tableColor bg-opacity-75 border border-tertiary" role="row">
        <th class="my-th" role="columnheader" scope="col">Фамилия</th>
        <th class="my-th" role="columnheader" scope="col">Имя</th>
        <th class="my-th" role="columnheader" scope="col">Отчество</th>
        <th class="my-th" role="columnheader" scope="col">Роль</th>
        <th class="my-th" role="columnheader" scope="col">Действия</th>
      </tr>
      </thead>
      <tbody role="rowgroup">
      <tr v-for="person in props.people" :key="person.id" class="bg-formColor" role="row">
        <td class="my-td border-l border-tertiary" role="cell">{{ person.lastName }}</td>
        <td class="my-td" role="cell">{{ person.firstName }}</td>
        <td class="my-td" role="cell">{{ person.patronymic }}</td>
        <td class="my-td" role="cell">{{ Role[person.role] }}</td>
        <td class="my-td border-r border-tertiary" role="cell">
          <EditAndDeleteButtons
              @deleteClick="deletePerson(person.id)"
              @editClick="showPersonEditDialog(person)"/>
        </td>
      </tr>
      </tbody>
    </table>
    <Dialog v-model:show="editPersonDialogVisible" aria-labelledby="dialog-title" >
      <h2 id="dialog-title" class="sr-only">Окно для редактирования пользователя</h2>
      <PersonForm v-if="selectedPerson" :person="selectedPerson" @savePersonData="editPerson"/>
    </Dialog>
  </div>
</template>