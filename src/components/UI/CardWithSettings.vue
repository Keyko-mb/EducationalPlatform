<script setup>
import {defineEmits, defineProps} from 'vue';
import EditAndDeleteButtons from "@/components/UI/EditAndDeleteButtons.vue";

const props = defineProps([
  "title",
  "description",
])

const emit = defineEmits(['click', 'editClick', 'deleteClick'])

const emitClick = () => {
  emit('click')
}
const emitEdit = () => {
  emit('editClick')
}
const emitDelete = () => {
  emit('deleteClick')
}

</script>


<template>
  <div class="flex gap-2">
    <div @click="emitClick" class="border rounded-lg p-3 border-secondary bg-tertiary cursor-pointer w-1/2 hover:bg-primary">
      <div class="flex flex-col">
        <h3>{{title}}</h3>
        <slot name="caption">{{description}}</slot>
      </div>
    </div>

    <EditAndDeleteButtons @deleteClick="emitDelete" @editClick="emitEdit"/>
  </div>

</template>