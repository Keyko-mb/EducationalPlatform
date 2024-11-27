<script setup>
import {useHomeworkStore} from "@/stores/homework.js";
import {computed, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useAnswerStore} from "@/stores/answer.js";

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId
const answers = computed(() => homeworkStore.answers)
const answerStore = useAnswerStore()

onMounted(async () => {
  await homeworkStore.fetchAnswers(homeworkId)
})

const saveComment = async (answer) => {
  try {
    await answerStore.updateComment(answer, answer.comment);
  } catch (error) {
    console.error("Ошибка при сохранении комментария:", error);
  }
}

const Status = {
  1: 'Не выполено',
  2: 'На проверке',
  3: 'Выполнено'
}
</script>

<template>
  <div v-if="answers && answers.length">
    <table class="w-full table-fixed border border-secondary bg-bgColor rounded-lg m-2">
      <thead>
      <tr>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>Статус</th>
        <th>Текст ответа</th>
        <th>Комментарий</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="answer in answers" :key="answer.id">
        <td>{{ answer.student?.lastName }}</td>
        <td>{{ answer.student?.firstName }}</td>
        <td>{{ answer.student?.patronymic }}</td>
        <td>
          <select class="my-select w-full" v-model="answer.statusId">
            <option v-for="(value, key) in Status" :key="key" :value="key">{{ value }}</option>
          </select>
        </td>
        <td class="break-words">{{ answer.text }}</td>
        <!--      <td>{{ answer.attachment }}</td>-->
        <!--        <td>{{answer.updatedAt}}</td>-->
        <td>
          <textarea
              v-model="answer.comment"
              placeholder="Введите комментарий..."
              class="my-input min-h-20 w-full"
          />
        </td>
        <td>
          <button @click="saveComment(answer)" class="border border-secondary bg-primary px-4 py-2 rounded-lg hover:bg-secondary w-f">
            Сохранить
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-else>Ответов нет</div>
</template>

<style scoped>

</style>