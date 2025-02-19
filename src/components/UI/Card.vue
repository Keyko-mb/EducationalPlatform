<script setup>
import { defineProps } from 'vue';

const props = defineProps([
    "type",
    "title",
    "description",
])
</script>


<template>
    <div class="flex items-center gap-3 border border-tertiary rounded-lg p-3 my-3 bg-formColor cursor-pointer lg:w-1/2 hover:brightness-95 transition-all"
         tabindex="0">
      <img v-if="type"
          :src="'/' + type + '.svg'"
          alt=""
          class="w-8 h-8 opacity-40"
          role="presentation">
      <div>
        <h3 id="card-title">{{title}}</h3>

        <slot name="caption">{{description}}</slot>
      </div>
    </div>
</template>