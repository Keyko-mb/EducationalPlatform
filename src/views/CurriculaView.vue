<script setup>

import {onMounted, ref} from 'vue';
import Card from '../components/UI/Card.vue'
import {useRouter} from "vue-router";
import {useCurriculaStore} from "@/stores/curricula.js";

const curriculaStore = useCurriculaStore();

onMounted (() => {
    curriculaStore.fetchCurricula();
})

const router = useRouter();

</script>

<template>
    <div>
        <h1>Обучение</h1>
        <div class="my-3">
          <Card v-for="curriculum in curriculaStore.curricula" :key="curriculum.id"
                @click="router.push(`/curricula/${curriculum.id}`)"
                :title="curriculum.name">
            <template #caption>
              <div>
                <p>{{ curriculum.description }}</p>
              </div>
            </template>
          </Card>
        </div>
      <button class="my-button" @click="router.push(`/curricula/create`)">Добавить</button>
    </div>
</template>

<style scoped>

</style>