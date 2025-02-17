<script setup>
import {useHomeworkStore} from "@/stores/homework.js";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useAnswerStore} from "@/stores/answer.js";
import {formatDate} from "../utils/dateFormatter.js";
import Dialog from "@/components/UI/Dialog.vue";
import FilesModal from "@/components/UI/FilesModal.vue";
import axios from "axios";

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId
const answers = computed(() => homeworkStore.answers)
const answerStore = useAnswerStore()
const isSaved = ref(false);

const totalPages = computed(() => homeworkStore.totalPages);
const currentPage = ref(0);
const pageSize = ref(10);

const selectedAnswer = ref(null)
const showFilesDialogVisible = ref(false)

onMounted(async () => {
  await homeworkStore.fetchAnswers(homeworkId, currentPage.value, pageSize.value);
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
  1: 'Не выполнено',
  2: 'На проверке',
  3: 'Выполнено'
}

onUnmounted(() => {
  answerStore.clearAnswer();
});

const getReport = async () => {
  try {
    const response = await axios.get("reports/homework/" + homeworkId, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", "Отчет по заданию - " + homework.value.name + ".xlsx");
    document.body.appendChild(link);
    link.click();

    link.remove();
  } catch (error) {
    console.error("Ошибка при экспорте файла:", error);
  }
}

const handlePageChange = async (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    await homeworkStore.fetchAnswers(homeworkId, currentPage.value, pageSize.value);
  }
};

const visiblePages = computed(() => {
  const maxVisible = 10;
  const pages = [];
  const total = totalPages.value;
  // Если количество страниц меньше или равно максимальному количеству отображаемых элементов, // возвращаем все страницы
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Определяем диапазон так, чтобы currentPage была примерно по центру
    const half = Math.floor(maxVisible / 2);
    let start = currentPage.value + 1 - half; // +1, т.к. currentPage начинается с 0
    if (start < 1) {
      start = 1;
    }
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = end - maxVisible + 1;
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  return pages;
});
</script>

<template>
  <div v-if="answers && answers.length">
    <h2 class="sr-only">Таблица ответов студентов</h2>
    <div class="flex justify-end mb-5">
      <button class="px-6 py-2 rounded-lg shadow-md transition duration-300 hover:brightness-110 border border-tertiary" @click="getReport">Отчет по заданию</button>
    </div>
    <table class="w-full table-fixed rounded-lg overflow-hidden border-collapse shadow-md">
      <thead>
        <tr class="bg-tableColor border border-tertiary rounded-t-lg">
          <th class="my-th" scope="col" >Фамилия</th>
          <th class="my-th" scope="col" >Имя</th>
          <th class="my-th" scope="col" >Отчество</th>
          <th class="my-th" scope="col" >Статус</th>
          <th class="my-th" scope="col" >Текст ответа</th>
          <th class="my-th" scope="col" >Вложения</th>
          <th class="my-th" scope="col" >Дата изменения</th>
          <th class="my-th" scope="col" >Комментарий</th>
          <th class="my-th" scope="col" >Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="answer in answers" :key="answer.id" class="bg-formColor" role="row">
          <td class="my-td border-l border-tertiary">{{ answer.student?.lastName }}</td>
          <td class="my-td">{{ answer.student?.firstName }}</td>
          <td class="my-td">{{ answer.student?.patronymic }}</td>
          <td class="my-td">
            <select class="my-select w-full" v-model="answer.statusId" aria-describedby="status-help" :aria-label='"Статус ответа: " + Status[answer.statusId]'>
              <option v-for="(value, key) in Status" :key="key" :value="key">{{ value }}</option>
            </select>
            <p id="status-help" class="sr-only">Используйте стрелки для выбора статуса, затем нажмите Enter.</p>
          </td>
          <td class="break-words my-td" >
            <label :for="'answer-text-' + answer.id" class="sr-only">Текст ответа</label>
            <textarea disabled class="rounded-lg my-input min-h-20 w-full" :id="'answer-text-' + answer.id" aria-readonly="true" :aria-label='"Текст ответа" + answer.text'>{{ answer.text }}</textarea>
          </td>

          <td v-if="answer.attachments &&answer.attachments.length > 0" class="my-td">
            <button class="my-link" @click="showFiles(answer)" :aria-label="'Открыть вложения для ' + answer.student?.lastName">Открыть</button>
          </td>
          <td v-else class="my-td opacity-50" aria-label="Вложения отсутствуют">Отсутствуют</td>

          <td class="my-td" :aria-label="'Дата изменения ответа' + formatDate(answer.updatedAt)">{{formatDate(answer.updatedAt)}}</td>

          <td class="my-td">
            <label :for="'comment-' + answer.id" class="sr-only">Введите комментарий</label>
            <textarea
                :id="'comment-' + answer.id"
                v-model="answer.comment"
                placeholder="Введите комментарий..."
                class="my-input min-h-20 w-full"
                :aria-label="'Текст комментария' + answer.comment"
            />
          </td>

          <td class="my-td border-r border-tertiary">
            <button @click="saveComment(answer)" class="my-button-danger" :aria-label="'Сохранить комментарий для ' + answer.student?.lastName">
              Сохранить
            </button>
  <!--          <p v-if="isSaved" class="opacity-80">Сохранено</p>-->
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center justify-center mt-4">
      <button
          class="px-3 py-1 border border-tertiary rounded-lg shadow-md bg-formColor transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
          :disabled="currentPage <= 0"
          @click="handlePageChange(currentPage - 1)">
        <
      </button>
      <div class="mx-3 flex space-x-1">
      <span
          v-for="n in visiblePages"
          :key="n"
          @click="handlePageChange(n - 1)"
          class="cursor-pointer px-3 py-1 rounded-lg"
          :class="{
          'bg-logoColor text-formColor': currentPage + 1 === n,
          'bg-formColor border border-tertiary': currentPage + 1 !== n
        }">
        {{ n }}
      </span>
      </div>
      <button
          class="px-3 py-1 border border-tertiary rounded-lg shadow-md bg-formColor transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
          :disabled="currentPage >= totalPages - 1"
          @click="handlePageChange(currentPage + 1)">
        >
      </button>
    </div>

    <Dialog v-model:show="showFilesDialogVisible">
      <h2 id="dialog-title" class="sr-only" aria-labelledby="dialog-title">Окно с вложениями</h2>
      <FilesModal :answer="selectedAnswer"/>
    </Dialog>
  </div>
  <div v-else>Ответов нет</div>
</template>

<style scoped>

</style>