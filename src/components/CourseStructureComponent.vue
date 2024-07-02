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

const curriculumId = useRoute().params.id
const router = useRouter()

const props = defineProps(["course"])
const emit = defineEmits(['deleteClick'])

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
      <Dialog v-model:show="editCourseDialogVisible">
        <CourseForm :course="course" @saveCourseData="editCourse"/>
      </Dialog>
    </div>
    <p>{{ props.course.description }}</p>
    <div class="cards-container space-y-3">

        <Card v-for="lesson in lessons" :key="lesson.id" :title="lesson.name" @click="router.push(`/curricula/${curriculumId}/courses/${course.id}/lessons/${lesson.id}`)">
          <template #caption>
            <div>
              <p>{{ lesson.description }}</p>
            </div>
          </template>
        </Card>


        <Card v-for="homework in homeworks" :key="homework.id" :title="homework.name" @click="router.push(`/curricula/${curriculumId}/courses/${course.id}/homeworks/${homework.id}`)">
          <template #caption>
            <div>
              <p>{{homework.description}}</p>
            </div>
          </template>
        </Card>

    </div>
    <div class="flex gap-2">
      <button class="my-button mt-2" @click="showLessonAddDialog">Добавить урок</button>
      <button class="my-button mt-2" @click="showHomeworkAddDialog">Добавить задание</button>
    </div>
    <Dialog v-model:show="addLessonDialogVisible">
      <LessonForm @saveLessonData="addLesson"/>
    </Dialog>
    <Dialog v-model:show="addHomeworkDialogVisible">
      <HomeworkForm @saveHomeworkData="addHomework"/>
    </Dialog>
  </div>
</template>