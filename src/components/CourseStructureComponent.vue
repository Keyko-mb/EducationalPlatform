<script setup>

import {defineEmits, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import Card from "@/components/UI/Card.vue";
import EditAndDeleteButtons from "@/components/UI/EditAndDeleteButtons.vue";
import Dialog from "@/components/UI/Dialog.vue";
import CourseForm from "@/components/Forms/CourseForm.vue";
import LessonForm from "@/components/Forms/LessonForm.vue";
import HomeworkForm from "@/components/Forms/HomeworkForm.vue";
import {useAuthStore} from "@/stores/auth.js";

const curriculumId = useRoute().params.id
const router = useRouter()

const props = defineProps(["course"])
const emit = defineEmits(['deleteClick'])

const authStore = useAuthStore()

const editCourseDialogVisible = ref(false)
const addLessonDialogVisible = ref(false)
const addHomeworkDialogVisible = ref(false)

const emitDeleteCourse = () => {
  emit('deleteClick', props.course.id)
}

const lessons = ref([])
const homeworks = ref([])

onMounted( () => {
  axios.get(`courses/${props.course.id}/lessons`).then((response) => {
    lessons.value = response.data
  })
  axios.get(`courses/${props.course.id}/homeworks`).then((response) => {
    homeworks.value = response.data
  })
})

const editCourse = (updatedCourse) => {
  axios
      .put(`courses/${updatedCourse.id}`, updatedCourse)
  editCourseDialogVisible.value = false;
}

const addLesson = (lesson) => {
  lesson.courseId = props.course.id
  axios
      .post("lessons", lesson)
      .then((response) => {
        lessons.value.push(response.data)
        axios
            .put(`lessons/${response.data.id}/course/${props.course.id}`)
      })
  addLessonDialogVisible.value = false;
}

const addHomework = (homework) => {
  homework.courseId = props.course.id
  axios
      .post("homeworks", homework)
      .then((response) => {
        homeworks.value.push(response.data)
        axios
            .put(`homeworks/${response.data.id}/course/${props.course.id}`)
      })
  addHomeworkDialogVisible.value = false;
}

const showCourseEditDialog = () => {
  editCourseDialogVisible.value = true;
}

const showLessonAddDialog = () => {
  addLessonDialogVisible.value = true;
}

const showHomeworkAddDialog = () => {
  addHomeworkDialogVisible.value = true;
}
</script>

<template>
  <div class="my-5">
    <div class="flex gap-2">
      <h1 class="bg-bg">{{ props.course.name }}</h1>
      <EditAndDeleteButtons @deleteClick="emitDeleteCourse" @editClick="showCourseEditDialog"/>
      <Dialog v-model:show="editCourseDialogVisible" aria-labelledby="edit-course-title">
        <h2 id="edit-course-title" class="sr-only">Окно для редактирование раздела учебной программы</h2>
        <CourseForm :course="course" @saveCourseData="editCourse"/>
      </Dialog>
    </div>
    <p>{{ props.course.description }}</p>
    <p v-if="!props.course.access" class="bg-warnColor px-5 rounded-lg w-fit" aria-label="Статус раздела: скрыто">Скрыто</p>
    <div class="cards-container space-y-3" role="list">
      <h2 class="sr-only">Список уроков</h2>

      <Card v-for="lesson in lessons" :key="lesson.id" :title="lesson.name" @click="router.push(`/curricula/${curriculumId}/courses/${course.id}/lessons/${lesson.id}`)"
            role="listitem">
        <template #caption>
          <div>
            <p>{{ lesson.description }}</p>
            <p v-if="!lesson.access" class="bg-warnColor px-5 rounded-lg w-fit" aria-label="Статус урока: скрыто">Скрыто</p>
          </div>
        </template>
      </Card>

      <h2 class="sr-only">Список домашних заданий</h2>
      <Card v-for="homework in homeworks" :key="homework.id" :title="homework.name" @click="router.push(`/curricula/${curriculumId}/courses/${course.id}/homeworks/${homework.id}/teacher`)"
            role="listitem">
        <template #caption>
          <div>
            <p>{{homework.description}}</p>
            <p v-if="!homework.access" class="bg-warnColor px-5 rounded-lg w-fit" aria-label="Статус задания: скрыто">Скрыто</p>
          </div>
        </template>
      </Card>
    </div>

    <div class="flex gap-2">
      <button class="my-button mt-2" @click="showLessonAddDialog">Добавить урок</button>
      <button class="my-button mt-2" @click="showHomeworkAddDialog">Добавить задание</button>
    </div>
    <Dialog v-model:show="addLessonDialogVisible" aria-labelledby="add-lesson-title">
      <h2 id="add-lesson-title" class="sr-only">Окно для добавления нового урока</h2>
      <LessonForm @saveLessonData="addLesson"/>
    </Dialog>
    <Dialog v-model:show="addHomeworkDialogVisible" aria-labelledby="add-homework-title" >
      <h2 id="add-homework-title" class="sr-only">Окно для добавления нового домашнего задания</h2>
      <HomeworkForm @saveHomeworkData="addHomework"/>
    </Dialog>
  </div>
</template>