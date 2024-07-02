<script setup>

import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";

const lesson = ref({})
const lessonId = useRoute().params.lessonId

onMounted(() => {
  axios.get(`lessons/${lessonId}`).then((response) => {
    lesson.value = response.data
  })
})

</script>

<template>
    <div>
        <h1>{{ lesson.name }}</h1>
        <h3>{{ lesson.description }}</h3>
        <div class="my-5">
            <p>{{lesson.content}}</p>
        </div>
    </div>
</template>
