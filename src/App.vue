<script setup>
import { RouterView } from 'vue-router';

import Navbar from './components/UI/Navbar.vue'
import CurriculaView from './views/CurriculaView.vue';


</script>

<template>
<main >
  <Navbar />
  <div class="container mx-auto my-5">
    <RouterView/>
  </div>

</main>
</template>

<style scoped>
</style>
