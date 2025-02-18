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
const deleteConfirmDialogVisible = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const filesStore = useFilesStore();
const isLoading = ref(true) // Добавляем состояние загрузки

onMounted(async () => {
  try {
    const response = await axios.get(`lessons/${lessonId}`)
    lesson.value = response.data

    if (lesson.value.attachments) {
      await Promise.all(lesson.value.attachments.map(file =>
          filesStore.fetchFile("lessons", lessonId, file)
      ))
      filesStore.refreshFiles()
    }
  } catch (error) {
    console.error("Ошибка загрузки урока:", error)
  } finally {
    isLoading.value = false
  }
});

const showLessonEditDialog = () => {
  editLessonDialogVisible.value = true;
}

const showDeleteConfirmDialog = () => {
  deleteConfirmDialogVisible.value = true;
}

const editLesson = async (updatedLesson) => {
  try {
    isLoading.value = true
    const response = await axios.put(`lessons/${lesson.value.id}`, updatedLesson)
    lesson.value = response.data
    filesStore.refreshFiles()
    editLessonDialogVisible.value = false
  } catch (error) {
    console.error("Ошибка при редактировании:", error)
  } finally {
    isLoading.value = false
  }
}

const deleteLesson = async () => {
  try {
    isLoading.value = true
    if (lesson.value.attachments) {
      await Promise.all(lesson.value.attachments.map(file =>
          filesStore.deleteFile('lessons', lessonId, file)
      ))
    }
    await axios.delete(`lessons/${lesson.value.id}`)
    await router.push(`/curricula/${curriculumId}`)
  } catch (error) {
    console.error("Ошибка при удалении:", error)
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  filesStore.clearFiles();
});
</script>

<template>
  <div>
    <div>
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between mb-2">
        <h1>{{ lesson.name }}</h1>
        <div v-if="authStore.userInfo.role === 'ADMIN' || authStore.userInfo.role === 'TEACHER'" class="flex gap-2">
          <button class="my-button" @click="showLessonEditDialog">Редактировать</button>
          <button class="my-button-danger" @click="showDeleteConfirmDialog">Удалить</button>
        </div>
      </div>

      <div>
        <section class="mb-5">
          <h2 class="mb-5">{{ lesson.description }}</h2>
          <p>{{ lesson.content }}</p>
        </section>

        <section v-if="lesson.attachments && lesson.attachments.length > 0">
          <h2 class="mb-2">Вложения</h2>
          <Files/>
        </section>
      </div>

      <Dialog v-model:show="editLessonDialogVisible" aria-labelledby="dialog-title">
        <h2 id="dialog-title" class="sr-only">Окно для редактирования урока</h2>
        <LessonForm :lesson="lesson" @saveLessonData="editLesson"/>
      </Dialog>

      <!-- Диалог подтверждения удаления -->
      <Dialog v-model:show="deleteConfirmDialogVisible" aria-labelledby="confirm-dialog-title">
        <h2 id="confirm-dialog-title" class="text-lg mb-4 text-left">Подтверждение удаления</h2>
        <p class="mb-4">Вы уверены, что хотите удалить этот урок?</p>
        <div class="flex gap-4 justify-end">
          <button @click="deleteConfirmDialogVisible = false" class="my-button">
            Отмена
          </button>
          <button @click="deleteLesson" class="my-button-danger">
            Удалить
          </button>
        </div>
      </Dialog>
    </div>
  </div>
</template>
