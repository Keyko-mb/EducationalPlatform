<script setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import Dialog from "@/components/UI/Dialog.vue";
import LessonForm from "@/components/Forms/LessonForm.vue";

const lesson = ref({})
const lessonId = useRoute().params.lessonId
const curriculumId = useRoute().params.curriculumId
const editLessonDialogVisible = ref(false)

const router = useRouter()

onMounted(() => {
  axios.get(`lessons/${lessonId}`).then((response) => {
    lesson.value = response.data
  })
})

const showLessonEditDialog = () => {
  editLessonDialogVisible.value = true;
}

const editLesson = (updatedLesson) => {
  axios
      .put(`lessons/${lesson.value.id}`, updatedLesson)
      .then((response) => {
        lesson.value = response.data
      })
  editLessonDialogVisible.value = false
}

const deleteLesson = () => {
  axios.delete(`lessons/${lesson.value.id}`)
  router.push(`/curricula/${curriculumId}`)
}

</script>

<template>
    <div>
      <div class="flex justify-between">
        <h1>{{ lesson.name }}</h1>
        <div class="flex gap-2">
          <button class="my-button" @click="showLessonEditDialog">Редактировать</button>
          <button class="border border-secondary bg-errColor px-4 py-2 rounded-lg hover:drop-shadow-lg" @click="deleteLesson">Удалить</button>
        </div>
      </div>
        <h3>{{ lesson.description }}</h3>
        <div class="my-5">
            <p>{{lesson.content}}</p>
        </div>
      <Dialog v-model:show="editLessonDialogVisible">
        <LessonForm :lesson="lesson" @saveLessonData="editLesson"/>
      </Dialog>
    </div>
</template>
