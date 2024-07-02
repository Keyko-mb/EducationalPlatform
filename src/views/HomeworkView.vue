<script setup>
import { ref, onMounted } from 'vue'

// const files = ref({})

// const uploadFile = () => {
//     files.value = this.$refs.files.files;
// }
// multiple @change="uploadFile"

import {useRoute} from "vue-router";
import axios from "axios";

const homework = ref({})
const homeworkId = useRoute().params.homeworkId

onMounted(() => {
  axios.get(`homeworks/${homeworkId}`).then((response) => {
    homework.value = response.data
  })
})

</script>


<template>
    <div>
        <h1>{{ homework.name }}</h1>
        <p class="bg-red-100 px-5 py-1 rounded-lg w-40 mt-2">Не выполнено</p>
        <div class="my-5">
          <h3>{{ homework.description }}</h3>
          <p>{{  homework.text }}</p>
        </div>
        <div class="space-y-2">
            <h1>Ответ</h1>
            <textarea class="my-input h-20" type="text" placeholder="Начните писать ответ..." />
            <input type="file" ref="files" 
                class="block w-full
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:bg-secondary
                file:text-bgColor
                hover:file:bg-secondary">
        </div>
        <button class="my-button mt-5 ">Отправить на проверку</button>
    </div>
</template>