<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);

const handleNavigation = async () => {
  isLoading.value = true;
  try {
    await router.push('/curricula');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="mb-10 flex flex-col items-start gap-5">

    <div v-if="isLoading" class="loader-container">
      <div class="loader"></div>
    </div>

    <h1>
      Сайт детского центра раннего развития и дополнительного образования "Мультизнайка"
    </h1>

    <button
        @click="handleNavigation"
        class="my-button w-auto"
        :disabled="isLoading"
    >
      <span v-if="!isLoading">Перейти к моим учебным программам</span>
      <span v-else>Загрузка...</span>
    </button>
  </div>
</template>