<script setup>
import {ref, onMounted, computed, onUnmounted} from 'vue'
import {useRoute} from "vue-router";
import {useHomeworkStore} from "@/stores/homework.js";
import {useAnswerStore} from "@/stores/answer.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import Files from "@/components/UI/Files.vue";
import {useFilesStore} from "@/stores/files.js";

const studentStore = useStudentStore()

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId
const filesStore = useFilesStore()
const homeworkFiles = ref(filesStore.decodedFiles);

const answerStore = useAnswerStore()
const answer = computed(() => answerStore.answer)
const answerText = ref('')

const answerFiles = ref(answerStore.decodedFiles);
const newFiles = ref([]);
const removedFiles = ref([]);

onMounted(async () => {
  await homeworkStore.fetchHomework(homeworkId)
  await answerStore.fetchAnswer(parseInt(homeworkId))
  for (const file of homework.value.attachments) {
    await filesStore.fetchFile('homeworks', homeworkId, file)
  }
  filesStore.refreshFiles();
  if (answer.value) {
    answerText.value = answer.value.text || '';
  }
})

const handleFileUpload = (event) => {
  newFiles.value = Array.from(event.target.files);
}

const submitAnswer = async () => {
  if (answer.value) {
    for (const file of removedFiles.value) {
      await answerStore.deleteFile(answer.value.id, file.name);
      answer.value.attachments = answer.value.attachments.filter(f => f !== file.name);
    }
    for (const file of newFiles.value) {
      const filename = await answerStore.uploadFile(answer.value.id, file);
      await answerStore.fetchFile(answer.value.id, filename);
      answer.value.attachments.push(filename);
    }
    answerStore.refreshFiles();
    const formData = {
      text: answerText.value,
      attachments: answer.value.attachments,
      studentId: studentStore.studentId,
      homeworkId: homeworkId,
      statusId: 2
    }
    answerStore.updateAnswer(answer.value.id, formData)
  }
  else {
    const formData = {
      text: answerText.value,
      attachments: [],
      studentId: studentStore.studentId,
      homeworkId: homeworkId,
      statusId: 2
    }
    answerStore.submitAnswer(formData, newFiles.value)
  }
  newFiles.value = [];
  removedFiles.value = [];
}

const removeFile = (file) => {
  try {
    answerFiles.value = Object.values(answerFiles.value).filter(f => f.name !== file.name);
    removedFiles.value.push(file);
  } catch (error) {
    console.error('Ошибка при удалении вложения:', error);
  }
}

const Status = {
  1: 'Не выполено',
  2: 'На проверке',
  3: 'Выполнено'
}

onUnmounted(() => {
  filesStore.clearFiles();
  answerStore.clearAnswer();
  homeworkStore.clearHomework();
});

</script>


<template>
    <div v-if="homework">
      <div class="mb-5">
        <h1>{{ homework.name }}</h1>
        <div v-if="answer && answer.statusId !== 1">
          <p v-if="answer.statusId === 2" class="bg-warnColor px-5 py-1 rounded-lg w-fit mt-2"> {{ Status[2] }}</p>
          <p v-if="answer.statusId === 3" class="bg-truthColor px-5 py-1 rounded-lg w-fit mt-2"> {{ Status[3] }}</p>
        </div>
        <div v-else>
          <p class="bg-errColor px-5 py-1 rounded-lg w-fit mt-2 shadow-md"> {{ Status[1] }}</p>
        </div>
        <div class="my-5 space-y-2">
          <p>{{ homework.description }}</p>
          <div v-if="homework.attachments &&homework.attachments.length > 0">
            <h3 class="mb-2">Вложения</h3>
            <Files :flag="'materials'"/>
          </div>
        </div>
      </div>

      <div>
        <h1 class="text-logoColor mb-2">Ваш ответ:</h1>
        <div v-if="answer && answer.statusId !== 1" class="space-y-5">
          <div>
            <p v-if="answer.text">{{answer.text}}</p>
            <div v-if="answer.attachments && answer.attachments.length > 0" class="my-2">
              <Files :flag="'answer'"/>
            </div>
          </div>
          <div v-if="answer.comment" >
            <h1 class="text-logoColor mb-2">Комментарий от преподавателя:</h1>
            <p>{{ answer.comment }}</p>
          </div>
        </div>

        <div v-else-if="answer && answer.statusId === 1">
          <form @submit.prevent="submitAnswer" class="flex flex-col">
            <textarea v-model="answerText" class="my-input h-28 w-full" type="text" placeholder="Начните писать ответ..." />
            <div v-if="answerFiles.length > 0">
              <label class="form-label" for="attachments">Вложения</label>

              <div class="border border-tertiary rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4" id="attachments">
                <div
                    v-for="(file, index) in answerFiles"
                    :key="'file-' + index"
                    class="flex items-center mb-2">
                  <div v-if="file.type.startsWith('image')" class="relative">
                    <img :src="file.url" alt="Изображение" width="150" class="rounded-lg" />
                    <input @click.prevent="removeFile(file)"
                           type="image"
                           alt="Удалить"
                           src='/delete.svg'
                           class="absolute top-2 right-2 w-6 h-6 bg-errColor rounded-full p-1 hover:shadow-lg hover:opacity-100 opacity-80"/>
                  </div>

                  <div v-else class="flex h-full w-full px-2 py-1 rounded-lg border border-tertiary ">
                    <a :href="file.url"
                       :download="'file-' + index"
                       class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ index + 1 }}</a>
                    <input @click.prevent="removeFile(file)"
                           type="image"
                           alt="Удалить"
                           src='/delete.svg'
                           class="w-6 h-6 opacity-80 hover:opacity-100 mt-2 bg-errColor rounded-full p-1"/>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label for="new-attachments">Добавить вложения</label>
              <input type="file" multiple id="new-attachments"
                     @change="handleFileUpload"
                     ref="fileInput"
                     class="my-file">
            </div>

            <button type="submit" class="my-button mt-5 w-1/5">Отправить на проверку</button>
          </form>

          <div v-if="answer.comment" class="mt-5">
            <h1 class="text-logoColor mb-2">Комментарий от преподавателя:</h1>
            <p>{{ answer.comment }}</p>
          </div>
        </div>
        <div v-else>
          <form @submit.prevent="submitAnswer" class="flex flex-col">
            <textarea v-model="answerText" class="my-input h-28 w-1/2" type="text" placeholder="Начните писать ответ..." />
            <div v-if="answerFiles.length > 0" class="mt-3">
              <label class="form-label" for="attachments">Вложения</label>

              <div class="border border-tertiary rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4" id="attachments">
                <div
                    v-for="(file, index) in answerFiles"
                    :key="'file-' + index"
                    class="flex items-center mb-2">
                  <div v-if="file.type.startsWith('image')" class="relative">
                    <img :src="file.url" alt="Изображение" width="150" class="rounded-lg" />
                  </div>

                  <div v-else class="flex h-full w-full px-2 py-1 rounded-lg border border-tertiary ">
                    <a :href="file.url"
                       :download="'file-' + index"
                       class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ index + 1 }}</a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label for="new-attachments" class="mt-3">Добавить вложения</label>
              <input type="file" multiple id="new-attachments"
                     @change="handleFileUpload"
                     ref="fileInput"
                     class="my-file">
            </div>

            <button type="submit" class="my-button mt-5 w-1/5">Отправить на проверку</button>
          </form>
        </div>
      </div>
    </div>
</template>