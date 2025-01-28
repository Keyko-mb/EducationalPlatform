<script setup>
import { defineProps } from 'vue';

const props = defineProps([
    "title",
    "description",
])

</script>


<template>
    <div class="border border-tertiary rounded-lg p-3 my-3 bg-formColor cursor-pointer w-1/2 hover:brightness-95 transition-all"
         tabindex="0">

      <h3 id="card-title">{{title}}</h3>

      <slot name="caption">{{description}}</slot>

    </div>
</template>