<script setup>

import PersonForm from "@/components/Forms/PersonForm.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const id = useRoute().params.id

const person = ref({})

onMounted(() => {
  axios.get(`people/${id}`).then((response) => {
    person.value = response.data
  })
})

const editPerson = (person) => {
  axios
      .put(`people/${person.id}`, person)
}
</script>

<template>
  <div>
    <h1>Редактировать пользователя</h1>
    <PersonForm
        @savePersonData="editPerson"
        :person="person"/>
  </div>
</template>

<style scoped>

</style>