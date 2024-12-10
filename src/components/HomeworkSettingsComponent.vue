<script setup>
import HomeworkForm from "@/components/Forms/HomeworkForm.vue";
import {useHomeworkStore} from "@/stores/homework.js";
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";
import {useFilesStore} from "@/stores/files.js";

const router = useRouter()
const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const curriculumId = useRoute().params.curriculumId
const filesStore = useFilesStore();

const editHomework = async (updatedHomework, newFiles) => {
  await homeworkStore.updateHomework(homework.value.id, updatedHomework)
  for (const file of newFiles) {
    const filename = await filesStore.uploadFile('homeworks', homework.value.id, file);
    await filesStore.fetchFile('homeworks', homework.value.id, filename);
  }
  filesStore.refreshFiles();
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
    <button class="my-button-danger mt-2" @click="deleteHomework">Удалить</button>
  </div>
</template>

<style scoped>

</style>