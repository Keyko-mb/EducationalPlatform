<script setup>
import { defineProps } from 'vue';

const props = defineProps([
    "name",
    "description",
])

</script>


<template>
    <div class="border rounded-lg p-3 my-3 border-secondary bg-tertiary cursor-pointer w-1/2 hover:bg-primary">

        <h3>{{name}}</h3>

        <slot name="caption">{{description}}</slot>

    </div>
</template>