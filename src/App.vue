<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/UI/Navbar.vue'
</script>

<template>
<main>
  <Navbar />
  <div class="container mx-auto my-5">
    <RouterView/>
  </div>
</main>
</template>
