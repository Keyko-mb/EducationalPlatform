<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRoute} from "vue-router";
import {useHomeworkStore} from "@/stores/homework.js";
import {useAnswerStore} from "@/stores/answer.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import Files from "@/components/UI/Files.vue";


// const uploadFile = () => {
//     files.value = this.$refs.files.files;
// }
// multiple @change="uploadFile"

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId

const answerStore = useAnswerStore()
const answer = computed(() => answerStore.answer)
const answerText = ref('')
const file = ref(null)

const studentStore = useStudentStore()

onMounted(async () => {
  await homeworkStore.fetchHomework(homeworkId)
  await answerStore.fetchAnswer(parseInt(homeworkId))
  if (answer.value) {
    answerText.value = answer.value.text || '';
  }
})

const submitAnswer = () => {
    const formData = {
      text: answerText.value,
      attachment: file.value,
      studentId: studentStore.studentId,
      homeworkId: homeworkId,
      statusId: 2
    }
  if (answer.value) {
    answerStore.updateAnswer(answer.value.id, formData)
  } else {
    answerStore.submitAnswer(formData)
  }
}

const Status = {
  1: 'Не выполено',
  2: 'На проверке',
  3: 'Выполнено'
}

</script>


<template>
    <div v-if="homework">
      <h1>{{ homework.name }}</h1>
      <div v-if="answer && answer.statusId !== 1">
        <p v-if="answer.statusId === 2" class="bg-warnColor px-5 py-1 rounded-lg w-fit mt-2"> {{ Status[2] }}</p>
        <p v-if="answer.statusId === 3" class="bg-truthColor px-5 py-1 rounded-lg w-fit mt-2"> {{ Status[3] }}</p>
      </div>
      <div v-else>
        <p class="bg-errColor px-5 py-1 rounded-lg w-fit mt-2"> {{ Status[1] }}</p>
      </div>
      <div class="my-5 space-y-2">
        <p>{{ homework.description }}</p>
        <div v-if="homework.attachments">
          <h3 class="mb-2">Вложения</h3>
          <Files/>
        </div>
      </div>

      <div>
        <div v-if="answer && answer.statusId !== 1" class="space-y-5">
          <div>
            <h1>Ваш ответ:</h1>
            <p v-if="answer.text">{{answer.text}}</p>
<!--            <p v-if="answer.attachment">Вложение: <a :href="answer.attachment">Скачать</a></p>-->
          </div>
          <div v-if="answer.comment" >
            <h1>Комментарий от преподавателя:</h1>
            <p>{{ answer.comment }}</p>
          </div>
        </div>
        <div v-else>
          <form @submit.prevent="submitAnswer" class="flex flex-col">
            <textarea v-model="answerText" class="my-input h-28 w-1/2" type="text" placeholder="Начните писать ответ..." />
<!--            <input type="file" ref="files"-->
<!--                   class="block w-full-->
<!--                    file:mr-4 file:py-2 file:px-4-->
<!--                    file:rounded-full file:border-0-->
<!--                    file:bg-secondary-->
<!--                    file:text-bgColor-->
<!--                    hover:file:bg-secondary">-->
            <button type="submit" class="my-button mt-5 w-1/5">Отправить на проверку</button>
          </form>
        </div>
      </div>
    </div>
</template>