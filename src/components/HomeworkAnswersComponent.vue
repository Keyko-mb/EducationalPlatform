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
    <table class="w-full rounded-lg overflow-hidden border-collapse shadow-md">
      <thead>
      <tr class="bg-tertiary bg-opacity-75">
        <th class="my-th">Фамилия</th>
        <th class="my-th">Имя</th>
        <th class="my-th">Отчество</th>
        <th class="my-th">Статус</th>
        <th class="my-th">Текст ответа</th>
        <th class="my-th">Комментарий</th>
        <th class="my-th"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="answer in answers" :key="answer.id" class="bg-formColor ">
        <td class="my-td">{{ answer.student?.lastName }}</td>
        <td class="my-td">{{ answer.student?.firstName }}</td>
        <td class="my-td">{{ answer.student?.patronymic }}</td>
        <td class="my-td">
          <select class="my-select w-full" v-model="answer.statusId">
            <option v-for="(value, key) in Status" :key="key" :value="key">{{ value }}</option>
          </select>
        </td>
        <td class="break-words my-td">{{ answer.text }}</td>
        <!--      <td>{{ answer.attachment }}</td>-->
        <!--        <td>{{answer.updatedAt}}</td>-->
        <td class="my-td">
          <textarea
              v-model="answer.comment"
              placeholder="Введите комментарий..."
              class="my-input min-h-20 w-full"
          />
        </td>
        <td class="my-td">
          <button @click="saveComment(answer)" class="my-button-danger">
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