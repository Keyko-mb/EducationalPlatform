<script setup>

import Card from "@/components/UI/Card.vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";

const curriculumId = useRoute().params.id

const props = defineProps(["course"])

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
</script>

<template>
  <div class="my-3">
    <h1 class="bg-bg">{{ props.course.name }}</h1>
    <p>{{ props.course.description }}</p>
    <div class="cards-container">
      <RouterLink
          v-for="lesson in lessons" :key="lesson.id"
          :to="`/curricula/${curriculumId}/lessons/${lesson.id}`">
        <Card :name="lesson.name">
          <template #caption>
            <div>
              <p>{{ lesson.description }}</p>
            </div>
          </template>
        </Card>
      </RouterLink>
      <RouterLink
          v-for="homework in homeworks" :key="homework.id"
          :to="`/curricula/${curriculumId}/homeworks/${homework.id}`">
        <Card :name="homework.name">
          <template #caption>
            <div>
              <p>{{homework.description}}</p>
            </div>
          </template>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>