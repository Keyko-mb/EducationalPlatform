<script setup>
import HomeworkForm from "@/components/Forms/HomeworkForm.vue";
import {useHomeworkStore} from "@/stores/homework.js";
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";

const router = useRouter()
const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const curriculumId = useRoute().params.curriculumId

//нужно проверить снова методы с учетом store

const editHomework = (updatedHomework) => {
  homeworkStore.updateHomework(homework.value.id, updatedHomework)
}

const deleteHomework = () => {
  homeworkStore.deleteHomework(homework.value.id)
  router.push(`/curricula/${curriculumId}`)
}
</script>

<template>
  <div>
    <HomeworkForm :homework="homework" @saveHomeworkData="editHomework"/>
    <button class="border border-secondary bg-errColor px-4 py-2 mt-2 rounded-lg hover:drop-shadow-lg" @click="deleteHomework">Удалить</button>
  </div>
</template>

<style scoped>

</style>