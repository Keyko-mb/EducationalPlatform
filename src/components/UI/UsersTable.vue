<script setup lang="ts">
import {defineProps} from "vue";
defineProps(["users"]);
</script>

<template>
  <table class="w-full border border-secondary bg-tertiary rounded-lg">
    <thead>
    <tr>
      <th>Фамилия</th>
      <th>Имя</th>
      <th>Отчество</th>
      <th>Роль</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user.lastName }}</td>
      <td>{{ user.firstName }}</td>
      <td>{{ user.patronymic }}</td>
      <td>{{ user.role }}</td>
    </tr>
    </tbody>
  </table>
</template>


<style>
th, td {
  padding: 10px;
  text-align: center;
  @apply border-b border-secondary;
}
</style>