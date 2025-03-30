<script setup>
import {ref, onMounted, computed, onUnmounted, h} from 'vue'
import {useRoute} from "vue-router";
import {useHomeworkStore} from "@/stores/homework.js";
import {useAnswerStore} from "@/stores/answer.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import Files from "@/components/UI/Files.vue";
import {useFilesStore} from "@/stores/files.js";
import ToastMessage from "@/components/UI/ToastMessage.vue";
import {useToast} from "vue-toastification";
import Loader from "@/components/UI/Loader.vue";

const studentStore = useStudentStore()
const homeworkStore = useHomeworkStore()
const filesStore = useFilesStore()
const answerStore = useAnswerStore()

const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId
const homeworkFiles = ref(filesStore.decodedFiles)
const answer = computed(() => answerStore.answer)

const answerText = ref('')
const answerFiles = ref(answerStore.decodedFiles)
const newFiles = ref([])
const removedFiles = ref([])
const isLoading = ref(false)

const toast = useToast();

const Status = {
  1: 'Не выполнено',
  2: 'На проверке',
  3: 'Выполнено'
}

onMounted(async () => {
  try {
    await Promise.all([
      homeworkStore.fetchHomework(homeworkId),
      answerStore.fetchAnswer(parseInt(homeworkId))
    ])

    if (homework.value.attachments) {
      await Promise.all(homework.value.attachments.map(file =>
          filesStore.fetchFile('homeworks', homeworkId, file)
      ))
      filesStore.refreshFiles()
    }

    if (answer.value) {
      answerText.value = answer.value.text
    }

  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    isLoading.value = false
  }
})

const handleFileUpload = (event) => {
  const MAX_FILE_SIZE = 10485760; // 10 МБ
  const filesArray = Array.from(event.target.files);
  const validFiles = [];
  let hasOversizedFiles = false;

  for (const file of filesArray) {
    if (file.size > MAX_FILE_SIZE) {
      const toastContent = h(ToastMessage, {
        message: "Ошибка загрузки",
        details: { info: `Файл ${file.name} превышает допустимый размер (10 МБ)` }
      });
      toast.error(toastContent);
      hasOversizedFiles = true;
    } else {
      validFiles.push(file);
    }
  }
  if (hasOversizedFiles) {
    event.target.value = '';
  }
  newFiles.value = validFiles;
};

const submitAnswer = async () => {
  try {
    isLoading.value = true;
    if (answer.value) {
      for (const file of removedFiles.value) {
        await answerStore.deleteFile(answer.value.id, file.name);
        answer.value.attachments = answer.value.attachments.filter(f => f !== file.name);
      }
      for (const file of newFiles.value) {
        const filename = await answerStore.uploadFile(answer.value.id, file);
        if (filename) { // Только если filename не null
          await answerStore.fetchFile(answer.value.id, filename);
          answer.value.attachments.push(filename);
        }
      }
      answerStore.refreshFiles();
      const formData = {
        text: answerText.value,
        attachments: answer.value.attachments,
        studentId: studentStore.studentId,
        homeworkId: homeworkId,
        statusId: 2
      };
      await answerStore.updateAnswer(answer.value.id, formData);
    } else {
      const formData = {
        text: answerText.value,
        attachments: [],
        studentId: studentStore.studentId,
        homeworkId: homeworkId,
        statusId: 2
      };
      await answerStore.submitAnswer(formData, newFiles.value);
    }
    newFiles.value = [];
    removedFiles.value = [];
  } catch (error) {
    console.error('Ошибка при отправке ответа:', error);
  } finally {
    isLoading.value = false;
  }
};

const removeFile = (file) => {
  try {
    answerFiles.value = Object.values(answerFiles.value).filter(f => f.name !== file.name);
    removedFiles.value.push(file);
  } catch (error) {
    console.error('Ошибка при удалении вложения:', error);
  }
}

onUnmounted(() => {
  filesStore.clearFiles();
  answerStore.clearAnswer();
  homeworkStore.clearHomework();
});
</script>

<template>
  <div>
    <Loader :is-active="isLoading" class="min-h-60"/>
    <div v-if="!isLoading">
      <div v-if="homework">
        <div class="mb-5">
          <h1 tabindex="0">{{ homework.name }}</h1>
          <div v-if="answer && answer.statusId !== 1">
            <p v-if="answer.statusId === 2" tabindex="0" class="bg-warnColor px-5 py-1 rounded-lg w-fit mt-2"
               aria-label="Статус: на проверке">{{ Status[2] }}</p>
            <p v-if="answer.statusId === 3" tabindex="0" class="bg-truthColor px-5 py-1 rounded-lg w-fit mt-2"
               aria-label="Статус: выполнено">{{ Status[3] }}</p>
          </div>
          <div v-else>
            <p tabindex="0" class="bg-errColor px-5 py-1 rounded-lg w-fit mt-2 shadow-md" aria-label="Статус: не выполнено">
              {{ Status[1] }}</p>
          </div>
          <div class="my-5 space-y-2">
            <p tabindex="0">{{ homework.description }}</p>
            <div v-if="homework.attachments && homework.attachments.length > 0">
              <h2 tabindex="0" class="mb-2">Вложения</h2>
              <Files :flag="'materials'"/>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-logoColor mb-2" tabindex="0">Ваш ответ:</h2>
          <div v-if="answer && answer.statusId !== 1" class="space-y-5">
            <div>
              <p tabindex="0" v-if="answer.text">{{ answer.text }}</p>
              <div v-if="answer.attachments && answer.attachments.length > 0" class="my-2">
                <Files :flag="'answer'"/>
              </div>
            </div>
            <div v-if="answer.comment">
              <h2 tabindex="0" class="text-logoColor mb-2">Комментарий от преподавателя:</h2>
              <p tabindex="0">{{ answer.comment }}</p>
            </div>
          </div>

          <div v-else-if="answer && answer.statusId === 1">
            <form @submit.prevent="submitAnswer" class="flex flex-col gap-2">
              <label for="answer-text" class="sr-only">Текст ответа</label>
              <textarea id="answer-text" v-model="answerText" class="my-input h-28 w-full" type="text"
                        :aria-label="answerText"/>
              <div v-if="answerFiles.length > 0">
                <label tabindex="0" class="form-label">Вложения</label>

                <div
                    class="border border-tertiary rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4"
                    role="list">
                  <div
                      v-for="(file, index) in answerFiles"
                      :key="'file-' + index"
                      class="flex items-center mb-2"
                      role="listitem">
                    <div v-if="file.type.startsWith('image')" class="relative">
                      <img :src="file.url" :alt="file.name || 'Изображение без названия'" width="150" class="rounded-lg"/>
                      <button
                          @click="removeFile(file)"
                          type="button"
                          class="absolute top-2 right-2 w-6 h-6 bg-errColor rounded-full px-1 hover:shadow-lg hover:opacity-100 opacity-80"
                          :aria-label='"Удалить изображение" + index + 1'
                      >
                        <img src="/delete.svg" alt="Удалить" class="w-6 h-6" role="presentation"/>
                      </button>
                    </div>

                    <div v-else class="flex w-full px-2 py-1 rounded-lg border border-tertiary ">
                      <a :href="file.url"
                         :download="'file-' + index"
                         class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ file.fileName }}</a>
                      <button
                          @click="removeFile(file)"
                          type="button"
                          class="w-6 h-6 opacity-80 hover:opacity-100 mt-2 bg-errColor rounded-full px-1"
                          :aria-label='"Удалить файл" + index + 1'
                      >
                        <img src="/delete.svg" alt="Удалить" class="w-6 h-6" role="presentation"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label for="new-attachments">Добавить вложения (размер файла не должен превышать 10 МБ):</label>
                <input type="file" multiple id="new-attachments"
                       @change="handleFileUpload"
                       ref="fileInput"
                       class="my-file">
              </div>

              <button type="submit" class="my-button mt-5 lg:w-1/5">Отправить на проверку</button>
            </form>

            <div v-if="answer.comment" class="mt-5">
              <h2 tabindex="0" class="text-logoColor mb-2">Комментарий от преподавателя:</h2>
              <p tabindex="0">{{ answer.comment }}</p>
            </div>
          </div>

          <div v-else>
            <form @submit.prevent="submitAnswer" class="flex flex-col">
              <label for="answer-text" class="sr-only">Текст ответа</label>
              <textarea id="answer-text" v-model="answerText" class="my-input h-28 w-full" type="text"
                        placeholder="Начните писать ответ..." :aria-label="answerText"/>
              <div v-if="answerFiles.length > 0" class="mt-3">
                <label class="form-label">Вложения</label>

                <div
                    class="border border-tertiary rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4"
                    role="list">
                  <div
                      v-for="(file, index) in answerFiles"
                      :key="'file-' + index"
                      class="flex items-center mb-2" role="listitem">
                    <div v-if="file.type.startsWith('image')" class="relative">
                      <img :src="file.url" :alt="`Прикрепленное изображение ${index + 1}`" width="150"
                           class="rounded-lg"/>
                    </div>

                    <div v-else class="flex w-full px-2 py-1 rounded-lg border border-tertiary ">
                      <a :href="file.url"
                         :download="'file-' + index"
                         class="hover:opacity-75 transition-all underline flex-grow p-2"
                         :aria-label="`Скачать файл: ${file.name || 'Без названия'}`">Скачать файл {{
                          file.fileName
                        }}</a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <label for="new-attachments">Добавить вложения (размер файла не должен превышать 10 МБ):</label>
                <input type="file" multiple id="new-attachments"
                       @change="handleFileUpload"
                       ref="fileInput"
                       class="my-file">
              </div>

              <button type="submit" class="my-button mt-5 lg:w-1/5" aria-label="Отправить ответ на проверку">Отправить
                на проверку
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>