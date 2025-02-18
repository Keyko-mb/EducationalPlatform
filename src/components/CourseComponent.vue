<script setup>
import Card from "@/components/UI/Card.vue";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";
import router from "@/router/index.js";

const curriculumId = useRoute().params.id
const authStore = useAuthStore()
const props = defineProps(["course"])

const lessons = ref([])
const homeworks = ref([])
const isLoading = ref(true)

onMounted(() => {
  const requests = [
    axios.get(`courses/${props.course.id}/lessons`)
        .then(response => lessons.value = response.data),

    axios.get(`courses/${props.course.id}/homeworks`)
        .then(response => homeworks.value = response.data)
  ]

  Promise.all(requests)
      .catch(error => console.error(error))
      .finally(() => isLoading.value = false)
})

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
  <div v-if="isLoading" class="loader-container">
    <div class="loader"></div>
  </div>

  <div v-else class="my-3">
    <h1 class="bg-bg">{{ props.course.name }}</h1>

    <section>
      <p>{{ props.course.description }}</p>
      <p v-if="!props.course.access" class="access" aria-label="Статус раздела: скрыто">Скрыто</p>
    </section>

    <section>
      <h2 class="sr-only">Список уроков</h2>

      <div role="list">
        <div v-for="lesson in filteredLessons"
             :key="lesson.id"
             role="listitem">
          <Card :title="lesson.name"
                @keydown.enter="router.push(`/curricula/${curriculumId}/courses/${props.course.id}/lessons/${lesson.id}`)"
                @click="router.push(`/curricula/${curriculumId}/courses/${props.course.id}/lessons/${lesson.id}`)">
            <template #caption>
              <div>
                <p>{{ lesson.description }}</p>
                <p v-if="!lesson.access" class="access" aria-label="Статус урока: скрыто">Скрыто</p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <section>
      <h2 class="sr-only">Список домашних заданий</h2>

      <div v-if="authStore.userInfo.role === 'STUDENT'" role="list">
        <div v-for="homework in filteredHomeworks" :key="homework.id" role="listitem">
          <Card :title="homework.name"
                @click="router.push(`/curricula/${curriculumId}/courses/${props.course.id}/homeworks/${homework.id}`)"
                @keydown.enter="router.push(`/curricula/${curriculumId}/courses/${props.course.id}/homeworks/${homework.id}`)">
            <template #caption>
              <div>
                <p>{{homework.description}}</p>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div v-else role="list">
        <div v-for="homework in filteredHomeworks" :key="homework.id" role="listitem">
          <Card :title="homework.name"
                @click="router.push(`/curricula/${curriculumId}/courses/${props.course.id}/homeworks/${homework.id}/teacher`)"
                @keydown.enter="router.push(`/curricula/${curriculumId}/courses/${props.course.id}/homeworks/${homework.id}/teacher`)">
            <template #caption>
              <div>
                <p>{{homework.description}}</p>
                <p v-if="!homework.access" class="access" aria-label="Статус задания: скрыто">Скрыто</p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

