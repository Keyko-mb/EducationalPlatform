<script setup>

import {defineEmits} from "vue";

const props = defineProps(["show"])

const emit = defineEmits(['hideDialog', 'update:show'])

const emitHideDialog = () => {
  emit('update:show', false)
}
</script>

<template>
  <div class="bg-black/50 flex fixed inset-x-0 inset-y-0" v-if="show" @click="emitHideDialog">
    <div @click.stop class="m-auto max-h-[52rem] min-w-[600px] max-w-[1100px] border border-tertiary rounded-lg p-5 bg-bgColor relative overflow-y-auto">
      <input @click="emitHideDialog"
             type="image"
             alt="close"
             src='/delete.svg'
             class="absolute right-3 top-3 cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"/>
      <slot></slot>
    </div>
  </div>
</template>