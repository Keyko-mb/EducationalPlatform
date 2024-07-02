<script setup>

import PersonForm from "@/components/Forms/PersonForm.vue";
import axios from "axios";

const createPerson = (person) => {
  axios
      .post("people", person)
}
</script>

<template>
    <div>
        <h1>Новый пользователь</h1>
        <PersonForm
        @savePersonData="createPerson"/>
    </div>
</template>