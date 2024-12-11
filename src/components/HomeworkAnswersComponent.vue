<script setup>
import {useHomeworkStore} from "@/stores/homework.js";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useAnswerStore} from "@/stores/answer.js";
import {formatDate} from "../utils/dateFormatter.js";
import Dialog from "@/components/UI/Dialog.vue";
import FilesModal from "@/components/UI/FilesModal.vue";

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId
const answers = computed(() => homeworkStore.answers)
const answerStore = useAnswerStore()
const isSaved = ref(false);

const selectedAnswer = ref(null)
const showFilesDialogVisible = ref(false)

onMounted(async () => {
  await homeworkStore.fetchAnswers(homeworkId)
})

const saveComment = async (answer) => {
  try {
    await answerStore.updateComment(answer, answer.comment);
    isSaved.value = true;
    setTimeout(() => {
      isSaved.value = false;
    }, 3000);
  } catch (error) {
    console.error("Ошибка при сохранении комментария:", error);
  }
}

const showFiles = (answer) => {
  selectedAnswer.value = { ...answer }
  showFilesDialogVisible.value = true;
}

const Status = {
  1: 'Не выполено',
  2: 'На проверке',
  3: 'Выполнено'
}

onUnmounted(() => {
  answerStore.clearAnswer();
});
</script>

<template>
  <div v-if="answers && answers.length">
    <table class="w-full table-fixed rounded-lg overflow-hidden border-collapse shadow-md">
      <thead>
      <tr class="bg-tableColor border border-tertiary rounded-t-lg">
        <th class="my-th">Фамилия</th>
        <th class="my-th">Имя</th>
        <th class="my-th">Отчество</th>
        <th class="my-th">Статус</th>
        <th class="my-th">Текст ответа</th>
        <th class="my-th">Вложения</th>
        <th class="my-th">Дата изменения</th>
        <th class="my-th">Комментарий</th>
        <th class="my-th"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="answer in answers" :key="answer.id" class="bg-formColor ">
        <td class="my-td border-l border-tertiary">{{ answer.student?.lastName }}</td>
        <td class="my-td">{{ answer.student?.firstName }}</td>
        <td class="my-td">{{ answer.student?.patronymic }}</td>
        <td class="my-td">
          <select class="my-select w-full" v-model="answer.statusId">
            <option v-for="(value, key) in Status" :key="key" :value="key">{{ value }}</option>
          </select>
        </td>
        <td class="break-words my-td">
          <textarea disabled class="rounded-lg my-input min-h-20 w-full">{{ answer.text }}</textarea>
        </td>

        <td v-if="answer.attachments &&answer.attachments.length > 0" class="my-td">
          <button class="my-link" @click="showFiles(answer)">Открыть</button>
        </td>
        <td v-else class="my-td opacity-50">Отсутствуют</td>

        <td class="my-td">{{formatDate(answer.updatedAt)}}</td>
        <td class="my-td">
          <textarea
              v-model="answer.comment"
              placeholder="Введите комментарий..."
              class="my-input min-h-20 w-full"
          />
        </td>
        <td class="my-td border-r border-tertiary">
          <button @click="saveComment(answer)" class="my-button-danger">
            Сохранить
          </button>
<!--          <p v-if="isSaved" class="opacity-80">Сохранено</p>-->
        </td>
      </tr>
      </tbody>
    </table>
    <Dialog v-model:show="showFilesDialogVisible">
      <FilesModal :answer="selectedAnswer"/>
    </Dialog>
  </div>
  <div v-else>Ответов нет</div>
</template>

<style scoped>

</style>