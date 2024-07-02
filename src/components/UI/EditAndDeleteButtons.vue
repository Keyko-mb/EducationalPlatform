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
  <div class="flex items-center gap-2">
    <input @click="emitEdit"
           type="image"
           alt="edit"
           src='/edit.svg'
           class="w-7 h-7 opacity-50 hover:opacity-100"/>
    <input @click="emitDelete"
           type="image"
           alt="delete"
           src='/delete.svg'
           class="w-5 h-5 opacity-50 hover:opacity-100"/>
  </div>
</template>

<style scoped>

</style>