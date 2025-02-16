<script setup>
import HomeworkForm from "@/components/Forms/HomeworkForm.vue";
import {useHomeworkStore} from "@/stores/homework.js";
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import {useFilesStore} from "@/stores/files.js";
import Dialog from "@/components/UI/Dialog.vue";

const router = useRouter()
const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const curriculumId = useRoute().params.curriculumId
const filesStore = useFilesStore();
const deleteConfirmDialogVisible = ref(false);

const editHomework = async (updatedHomework) => {
  await homeworkStore.updateHomework(homework.value.id, updatedHomework)
  filesStore.refreshFiles();
}

const showDeleteConfirmDialog = () => {
  deleteConfirmDialogVisible.value = true;
}

const deleteHomework = async () => {
  for (const file of homework.value.attachments) {
    await filesStore.deleteFile('homeworks', homework.value.id, file);
  }
  filesStore.clearFiles();
  await homeworkStore.deleteHomework(homework.value.id)
  await router.push(`/curricula/${curriculumId}`)
}
</script>

<template>
  <div>
    <HomeworkForm :homework="homework" @saveHomeworkData="editHomework"/>
    <button class="my-button-danger mt-2" @click="showDeleteConfirmDialog">Удалить</button>

    <Dialog v-model:show="deleteConfirmDialogVisible" aria-labelledby="confirm-dialog-title">
      <h2 id="confirm-dialog-title" class="text-lg mb-4">Подтверждение удаления</h2>
      <p class="mb-4">Вы уверены, что хотите удалить это домашнее задание?</p>
      <div class="flex gap-4 justify-end">
        <button
            @click="deleteConfirmDialogVisible = false"
            class="my-button"
        >
          Отмена
        </button>
        <button
            @click="deleteHomework"
            class="my-button-danger"
        >
          Удалить
        </button>
      </div>
    </Dialog>
  </div>
</template>
