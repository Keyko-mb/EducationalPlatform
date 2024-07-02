<script setup>
import { ref, onMounted } from 'vue'
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import Dialog from "@/components/UI/Dialog.vue";
import HomeworkForm from "@/components/Forms/HomeworkForm.vue";

// const files = ref({})

// const uploadFile = () => {
//     files.value = this.$refs.files.files;
// }
// multiple @change="uploadFile"
const router = useRouter();
const homework = ref({})
const homeworkId = useRoute().params.homeworkId
const curriculumId = useRoute().params.curriculumId
const editHomeworkDialogVisible = ref(false)

onMounted(() => {
  axios.get(`homeworks/${homeworkId}`).then((response) => {
    homework.value = response.data
  })
})

const showHomeworkEditDialog = () => {
  editHomeworkDialogVisible.value = true;
}

const editHomework = (updatedHomework) => {
  axios
      .put(`homeworks/${homework.value.id}`, updatedHomework)
      .then((response) => {
        homework.value = response.data
      })
  editHomeworkDialogVisible.value = false;
}

const deleteHomework = () => {
  axios.delete(`homeworks/${homework.value.id}`)
  router.push(`/curricula/${curriculumId}`)
}
</script>


<template>
    <div>
      <div class="flex justify-between">
        <h1>{{ homework.name }}</h1>
        <div class="flex gap-2">
          <button class="my-button" @click="showHomeworkEditDialog">Редактировать</button>
          <button class="border border-secondary bg-errColor px-4 py-2 rounded-lg hover:drop-shadow-lg" @click="deleteHomework">Удалить</button>
        </div>
      </div>
        <p class="bg-red-100 px-5 py-1 rounded-lg w-40 mt-2">Не выполнено</p>
        <div class="my-5">
          <h3>{{ homework.description }}</h3>
          <p>{{  homework.text }}</p>
        </div>
        <div class="space-y-2">
            <h1>Ответ</h1>
            <textarea class="my-input h-20" type="text" placeholder="Начните писать ответ..." />
            <input type="file" ref="files" 
                class="block w-full
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:bg-secondary
                file:text-bgColor
                hover:file:bg-secondary">
        </div>
        <button class="my-button mt-5 ">Отправить на проверку</button>
      <Dialog v-model:show="editHomeworkDialogVisible">
        <HomeworkForm :homework="homework" @saveHomeworkData="editHomework"/>
      </Dialog>
    </div>
</template>