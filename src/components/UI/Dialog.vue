<script setup>

import {defineEmits} from "vue";

const props = defineProps(["show"])

const emit = defineEmits(['hideDialog'])

const emitHideDialog = () => {
  emit('update:show', false)
}
</script>

<template>
  <div class="bg-black/50 flex fixed inset-x-0 inset-y-0" v-if="show" @click="emitHideDialog">
    <div @click.stop class="m-auto min-h-14 min-w-80 border border-secondary rounded-lg p-5 bg-tertiary relative">
      <input @click="emitHideDialog"
             type="image"
             alt="close"
             src='/delete.svg'
             class="absolute right-3 top-3 cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"/>
      <slot></slot>
    </div>
  </div>
</template>