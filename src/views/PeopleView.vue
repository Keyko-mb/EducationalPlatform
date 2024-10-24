<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";
import Dialog from "@/components/UI/Dialog.vue";
import PersonForm from "@/components/Forms/PersonForm.vue";
import PeopleTable from "@/components/UI/PeopleTable.vue";

const people = ref([])
const person = ref({})
const addPersonDialogVisible = ref(false)


onMounted(() => {
  axios.get('people').then((response) => {
    people.value = response.data
  })
})

const showAddPersonDialog = () => {
  addPersonDialogVisible.value = true;
}

const createPerson = (person) => {
  axios
      .post("auth/register", person)
      .then(() => {
        people.value.push(person)
      })
  addPersonDialogVisible.value = false
}
</script>

<template>
    <div>
        <h1>Пользователи</h1>
        <div class="flex justify-between my-3">
            <input class="border border-secondary px-4 py-2 rounded-lg" type="text" placeholder="Поиск...">
            <div class="flex gap-5">
<!--                <button class="my-button">Импорт</button>-->
                <button class="my-button" @click="showAddPersonDialog">Добавить</button>
            </div>
        </div>
        <PeopleTable :people="people"/>
    </div>

    <div>
      <Dialog v-model:show="addPersonDialogVisible">
        <h1>Новый пользователь</h1>
        <PersonForm
            @savePersonData="createPerson"
            :person="person"/>
      </Dialog>
    </div>
</template>
