<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import Dialog from "@/components/UI/Dialog.vue";
import LessonForm from "@/components/Forms/LessonForm.vue";
import {useAuthStore} from "@/stores/auth.js";
import Files from "@/components/UI/Files.vue";
import {useFilesStore} from "@/stores/files.js";

const lesson = ref({})
const lessonId = useRoute().params.lessonId
const curriculumId = useRoute().params.curriculumId
const editLessonDialogVisible = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const filesStore = useFilesStore();

onMounted(async () => {
  await axios.get(`lessons/${lessonId}`).then((response) => {
    lesson.value = response.data
  })
  if (lesson.value.attachments) {
    for (const file of lesson.value.attachments) {
      await filesStore.fetchFile("lessons", lessonId, file)
    }
    filesStore.refreshFiles();
  }
});

const showLessonEditDialog = () => {
  editLessonDialogVisible.value = true;
}

const editLesson = (updatedLesson) => {
  axios
      .put(`lessons/${lesson.value.id}`, updatedLesson)
      .then(async (response) => {
        lesson.value = response.data
        filesStore.refreshFiles();
      })
  editLessonDialogVisible.value = false
}

const deleteLesson = async () => {
  for (const file of lesson.value.attachments) {
    await filesStore.deleteFile('lessons', lessonId, file);
  }
  filesStore.clearFiles();
  await axios.delete(`lessons/${lesson.value.id}`)
  await router.push(`/curricula/${curriculumId}`)
}

onUnmounted(() => {
  filesStore.clearFiles();
});

const lessonFormRef = ref(null);

const focusFirstElement = () => {
  lessonFormRef.value?.focus();
};

</script>

<template>
    <div>

      <header class="flex justify-between">
        <h1>{{ lesson.name }}</h1>
        <div v-if="authStore.userInfo.role === 'ADMIN' || authStore.userInfo.role === 'TEACHER'" class="flex gap-2">
          <button class="my-button" @click="showLessonEditDialog" aria-label="Открыть окно для редактирования урока">Редактировать</button>
          <button class="my-button-danger" @click="deleteLesson" aria-label="Удалить урок">Удалить</button>
        </div>
      </header>

      <main>
        <section class="mb-5">
          <h2 class="mb-5">{{ lesson.description }}</h2>
          <p>{{lesson.content}}</p>
        </section>

        <section v-if="lesson.attachments && lesson.attachments.length > 0" aria-labelledby="attachments-title">
          <h2  id="attachments-title" class="mb-2">Вложения</h2>
          <Files/>
        </section>
      </main>

      <Dialog v-model:show="editLessonDialogVisible" @shown="focusFirstElement" aria-label="Окно редактирования урока">
        <LessonForm ref="lessonFormRef" :lesson="lesson" @saveLessonData="editLesson"/>
      </Dialog>

    </div>
</template>
