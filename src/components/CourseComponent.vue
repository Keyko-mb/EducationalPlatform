<script setup>

import Card from "@/components/UI/Card.vue";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";

const curriculumId = useRoute().params.id
const authStore = useAuthStore()

const props = defineProps(["course"])

const lessons = ref([])
const homeworks = ref([])

onMounted( () => {
  axios.get(`courses/${props.course.id}/lessons`).then((response) => {
    lessons.value = response.data
  })
  axios.get(`courses/${props.course.id}/homeworks`).then((response) => {
    homeworks.value = response.data
  })
});

const filteredLessons = computed(() => {
  return lessons.value.filter(lesson => {
    if (authStore.userInfo.role === 'STUDENT') {
      return lesson.access;
    }
    return true;
  });
});

const filteredHomeworks = computed(() => {
  return homeworks.value.filter(homework => {
    if (authStore.userInfo.role === 'STUDENT') {
      return homework.access;
    }
    return true;
  });
});

</script>

<template>
  <div class="my-3">
    <h1 class="bg-bg">{{ props.course.name }}</h1>
    <p>{{ props.course.description }}</p>
    <p v-if="!props.course.access" class="bg-warnColor px-5 rounded-lg w-fit">Скрыто</p>
    <div class="cards-container">
      <RouterLink
          v-for="lesson in filteredLessons" :key="lesson.id"
          :to="`/curricula/${curriculumId}/courses/${props.course.id}/lessons/${lesson.id}`">
        <Card :title="lesson.name">
          <template #caption>
            <div>
              <p>{{ lesson.description }}</p>
              <p v-if="!lesson.access" class="bg-warnColor px-5 rounded-lg w-fit">Скрыто</p>
            </div>
          </template>
        </Card>
      </RouterLink>

      <div v-if="authStore.userInfo.role === 'STUDENT'">
        <RouterLink
            v-for="homework in filteredHomeworks" :key="homework.id"
            :to="`/curricula/${curriculumId}/courses/${props.course.id}/homeworks/${homework.id}`">
          <Card :title="homework.name">
            <template #caption>
              <div>
                <p>{{homework.description}}</p>
              </div>
            </template>
          </Card>
        </RouterLink>
      </div>
      <div v-else>
        <RouterLink
            v-for="homework in homeworks" :key="homework.id"
            :to="`/curricula/${curriculumId}/courses/${props.course.id}/homeworks/${homework.id}/teacher`">
          <Card :title="homework.name">
            <template #caption>
              <div>
                <p>{{homework.description}}</p>
                <p v-if="!homework.access" class="bg-warnColor px-5 rounded-lg w-fit">Скрыто</p>
              </div>
            </template>
          </Card>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>