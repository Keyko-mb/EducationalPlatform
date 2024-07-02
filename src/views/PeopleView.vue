<script setup lang="ts">
import UsersTable from "@/components/UI/UsersTable.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const users = ref([])

const router = useRouter()

onMounted(() => {
  axios.get('people').then((response) => {
    users.value = response.data
  })
})

</script>

<template>
    <div>
        <h1>Пользователи</h1>
        <div class="flex justify-between my-3">
            <input class="border border-secondary px-4 py-2 rounded-lg" type="text" placeholder="Поиск...">
            <div class="flex gap-5">
<!--                <button class="my-button">Импорт</button>-->
                <button class="my-button" @click="router.push('/people/add')">Добавить</button>
            </div>
        </div>
        <UsersTable :users="users"/>
    </div>
</template>
