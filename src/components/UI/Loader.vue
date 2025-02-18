<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <transition name="fade">
    <div v-if="isActive" class="loader-container">
      <div class="loader"></div>
    </div>
  </transition>
</template>

<style scoped>
.loader-container {
  @apply flex items-center justify-center z-[9999];
}
.loader {
  @apply w-10 h-10 border-4 border-tertiary border-t-secondary rounded-full animate-spin;
}
/* Классы анимации перехода (fade) */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s; }
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
/* Определение анимации вращения */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>