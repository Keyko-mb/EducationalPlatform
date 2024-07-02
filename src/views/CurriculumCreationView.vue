<script setup>
import CurriculumForm from "@/components/Forms/CurriculumForm.vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {defineEmits} from "vue";
import {useCurriculaStore} from "@/stores/curricula.js";

const router = useRouter()
const curriculaStore = useCurriculaStore();

const createCurriculum = (curriculum) => {
  curriculaStore.addCurriculum(curriculum)
  router.push('/curricula')
}
</script>

<template>
  <div>
    <h1>Создание курса</h1>
    <CurriculumForm
    @saveCurriculumData="createCurriculum"/>
  </div>
</template>

<style scoped>

</style>