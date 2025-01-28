<script setup>
import {defineEmits} from "vue";

const emit = defineEmits(['editClick', 'deleteClick'])

const emitEdit = () => {
  emit('editClick')
}
const emitDelete = () => {
  emit('deleteClick')
}
</script>

<template>
  <div class="flex gap-2 justify-center">
    <button
        @click="emitEdit"
        class="opacity-50 hover:opacity-100"
        tabindex="0"
        aria-label="Редактировать"
    >
      <img
          src="/edit.svg"
          alt=""
          class="w-7 h-7"
          role="presentation"
      >
    </button>

    <button
        @click="emitDelete"
        class="opacity-50 hover:opacity-100"
        tabindex="0"
        aria-label="Удалить"
    >
      <img
          src="/delete.svg"
          alt=""
          class="w-6 h-6"
          role="presentation"
      >
    </button>
  </div>
</template>