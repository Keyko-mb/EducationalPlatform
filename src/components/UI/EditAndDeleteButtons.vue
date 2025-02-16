<script setup>
import { ref } from 'vue';
const emit = defineEmits(['editClick', 'deleteClick'])
const showConfirmDialog = ref(false);

const emitEdit = () => {
  emit('editClick')
}

const handleDelete = () => {
  showConfirmDialog.value = true;
}

const confirmDelete = () => {
  emit('deleteClick');
  showConfirmDialog.value = false;
}

const cancelDelete = () => {
  showConfirmDialog.value = false;
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
        @click="handleDelete"
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
  <div
      class="bg-black/50 flex fixed inset-x-0 inset-y-0"
      v-if="showConfirmDialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
  >
    <div class="m-auto min-w-[300px] border border-tertiary rounded-lg p-5 bg-bgColor">
      <h2 id="confirm-dialog-title" class="text-lg mb-4">Подтверждение удаления</h2>
      <p class="mb-4">Вы уверены, что хотите удалить этот элемент?</p>
      <div class="flex gap-4 justify-end">
        <button
            @click="cancelDelete"
            class="my-button"
        >
          Отмена
        </button>
        <button
            @click="confirmDelete"
            class="my-button-danger"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>
