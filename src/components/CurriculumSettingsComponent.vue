<script setup>
import CurriculumForm from "@/components/Forms/CurriculumForm.vue";
import axios from "axios";
import {defineProps, ref} from "vue";
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
    <CurriculumForm :curriculum="props.curriculum"
    @saveCurriculumData="editCurriculum"/>
    <button class="border border-secondary bg-errColor px-4 py-2 rounded-lg hover:drop-shadow-lg mt-5" @click="deleteCurriculum">Удалить</button>
  </div>
</template>