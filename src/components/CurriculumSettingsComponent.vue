<script setup>
import CurriculumForm from "@/components/Forms/CurriculumForm.vue";
import axios from "axios";
import {defineProps, ref} from "vue";
import {useRouter} from "vue-router";
import {useCurriculaStore} from "@/stores/curricula.js";
import Dialog from "@/components/UI/Dialog.vue";

const router = useRouter()
const curriculaStore = useCurriculaStore()
const deleteConfirmDialogVisible = ref(false);

const props = defineProps([
  "curriculum"
]);

const editCurriculum = (curriculum) => {
  axios
      .put("curricula/" + curriculum.id, curriculum)
      .then(response => console.log(response))
}

const showDeleteConfirmDialog = () => {
  deleteConfirmDialogVisible.value = true;
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

    <button class="mt-2 my-button-danger" @click="showDeleteConfirmDialog">Удалить</button>

    <Dialog v-model:show="deleteConfirmDialogVisible" aria-labelledby="confirm-dialog-title">
      <h2 id="confirm-dialog-title" class="text-lg mb-4">Подтверждение удаления</h2>
      <p class="mb-4">Вы уверены, что хотите удалить эту учебную программу?</p>
      <div class="flex gap-4 justify-end">
        <button
            @click="deleteConfirmDialogVisible = false"
            class="my-button"
        >
          Отмена
        </button>
        <button
            @click="deleteCurriculum"
            class="my-button-danger"
        >
          Удалить
        </button>
      </div>
    </Dialog>
  </div>
</template>
