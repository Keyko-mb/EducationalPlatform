<script setup>

import {onMounted, ref} from 'vue';
import Card from '../components/UI/Card.vue'
import {useRouter} from "vue-router";
import {useCurriculaStore} from "@/stores/curricula.js";
import {useAuthStore} from "@/stores/auth.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import Dialog from "@/components/UI/Dialog.vue";
import CurriculumForm from "@/components/Forms/CurriculumForm.vue";

const curriculaStore = useCurriculaStore();
const authStore = useAuthStore()
const studentStore = useStudentStore()
const curriculum = ref({})

onMounted (() => {
  if (authStore.userInfo.role === "STUDENT") {
    curriculum.value = studentStore.curriculumId
  } else {
    curriculaStore.fetchCurricula();
  }
})

const router = useRouter();
const addCurriculumDialogVisible = ref(false)

const showCurriculumAddDialog = () => {
  addCurriculumDialogVisible.value = true;
}

const addCurriculum = (curriculum) => {
  curriculaStore.addCurriculum(curriculum)
  addCurriculumDialogVisible.value = false;
}

</script>

<template>
    <div>
        <h1>Обучение</h1>
        <div class="my-3">
          <div v-if="authStore.userInfo.role === 'ADMIN' || authStore.userInfo.role === 'TEACHER'">
            <div v-if="curriculaStore.curricula.length > 0">
              <Card v-for="curriculum in curriculaStore.curricula" :key="curriculum.id"
                    @click="router.push(`/curricula/${curriculum.id}`)"
                    :title="curriculum.name">
                <template #caption>
                  <div>
                    <p>{{ curriculum.description }}</p>
                  </div>
                </template>
              </Card>
            </div>
            <div v-else class="mb-5">
              <p>Учебные программы отсутствуют</p>
            </div>
            <button v-if="authStore.userInfo.role === 'ADMIN'" class="my-button" @click="showCurriculumAddDialog">Добавить учебную программу</button>
            <Dialog v-model:show="addCurriculumDialogVisible">
              <CurriculumForm @saveCurriculumData="addCurriculum"/>
            </Dialog>

          </div>
          <div v-else>
            <div v-if="curriculum">
              <Card :key="curriculum.id"
                    @click="router.push(`/curricula/${curriculum.id}`)"
                    :title="curriculum.name">
                <template #caption>
                  <div>
                    <p>{{ curriculum.description }}</p>
                  </div>
                </template>
              </Card>
            </div>
            <div v-else>
              <p>Вы не обучаетесь ни на одной учебной программе</p>
            </div>
          </div>
        </div>
    </div>
</template>

<style scoped>

</style>