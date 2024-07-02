<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";

const person = ref({})

onMounted(() => {
  axios
    .get(`people/${3}`)
    .then((response) => {
      person.value = response.data
    })
})

</script>


<template>
    <div>
        <h1>{{`${person.lastName} ${person.firstName}`}}</h1>
        <div class="my-3">
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-400">Роль</p>
                    <p>{{ person.role }}</p>
                </div>
<!--                <div>-->
<!--                    <p class="text-sm text-gray-400">Обучение</p>-->
<!--                    <p>3 года</p>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>