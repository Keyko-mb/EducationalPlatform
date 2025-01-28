<script setup>
import CurriculumForm from "@/components/Forms/CurriculumForm.vue";
import axios from "axios";
import {defineProps} from "vue";
import {useRouter} from "vue-router";
import {useCurriculaStore} from "@/stores/curricula.js";

const router = useRouter()
const curriculaStore = useCurriculaStore()

const props = defineProps([
  "curriculum"
]);

const editCurriculum = (curriculum) => {
  axios
      .put("curricula/" + curriculum.id, curriculum)
      .then(response => console.log(response))
}

const deleteCurriculum = () => {
  curriculaStore.deleteCurriculum(props.curriculum)
  router.push('/curricula')
}

</script>

<template>
  <div>
    <h2 class="sr-only">Редактирование учебной программы</h2>

    <CurriculumForm :curriculum="props.curriculum"
    @saveCurriculumData="editCurriculum"/>

    <button class="mt-2 my-button-danger" @click="deleteCurriculum">Удалить</button>
  </div>
</template>