<script setup>
defineProps({
  message: String,
  details: Object
});
</script>

<template>
  <div class="container">
    <strong v-if="message">{{ message }}</strong>
    <strong v-else>Ошибка</strong>
    <ul v-if="details">
      <li v-for="(error, field) in details" :key="field">
        {{ error }}
      </li>
    </ul>
  </div>
</template>