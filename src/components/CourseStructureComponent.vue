<script setup>

import Card from "@/components/UI/Card.vue";
import {defineEmits, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import CardWithSettings from "@/components/UI/CardWithSettings.vue";
import EditAndDeleteButtons from "@/components/UI/EditAndDeleteButtons.vue";

const curriculumId = useRoute().params.id
const router = useRouter()

const props = defineProps(["course"])
const emit = defineEmits(['editClick', 'deleteClick'])

const emitDeleteCourse = () => {
  emit('deleteClick')
}

const  lessons = ref([])
const  homeworks = ref([])

onMounted( () => {
  axios.get(`courses/${props.course.id}/lessons`).then((response) => {
    lessons.value = response.data
  })
  axios.get(`courses/${props.course.id}/homeworks`).then((response) => {
    homeworks.value = response.data
  })
})

const deleteLesson = (id) => {
  axios.delete(`lessons/${id}`)
  lessons.value.filter(lesson => lesson.id !== id)
}
const deleteHomework = (id) => {
  axios.delete(`homeworks/${id}`)
  homeworks.value.filter(homework => homework.id !== id)
}
</script>

<template>
  <div class="my-5">
    <div class="flex gap-2">
      <h1 class="bg-bg">{{ props.course.name }}</h1>
      <EditAndDeleteButtons @deleteClick="emitDeleteCourse" @editClick="editCourse"/>
    </div>
    <p>{{ props.course.description }}</p>
    <div class="cards-container space-y-3">

        <CardWithSettings v-for="lesson in lessons" :key="lesson.id" :title="lesson.name" @click="router.push(`/curricula/${curriculumId}/lessons/${lesson.id}`)" @editClick="router.push(`/lessons/${lesson.id}/edit`)" @deleteClick="deleteLesson(lesson.id)">
          <template #caption>
            <div>
              <p>{{ lesson.description }}</p>
            </div>
          </template>
        </CardWithSettings>


        <CardWithSettings v-for="homework in homeworks" :key="homework.id" :title="homework.name" @click="router.push(`/curricula/${curriculumId}/homeworks/${homework.id}`)" @editClick="router.push(`/homeworks/${homework.id}/edit`)" @deleteClick="deleteHomework(homework.id)">
          <template #caption>
            <div>
              <p>{{homework.description}}</p>
            </div>
          </template>
        </CardWithSettings>

    </div>
    <div class="flex gap-2">
      <button class="my-button mt-2" @click="router.push(`/lessons/create`)">Добавить урок</button>
      <button class="my-button mt-2" @click="router.push(`/homeworks/create`)">Добавить задание</button>
    </div>
  </div>
</template>