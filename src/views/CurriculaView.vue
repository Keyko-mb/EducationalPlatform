<script setup>

import {computed, onMounted, onUnmounted, ref} from 'vue';
import Card from '../components/UI/Card.vue'
import {useRouter} from "vue-router";
import {useCurriculaStore} from "@/stores/curricula.js";
import {useAuthStore} from "@/stores/auth.js";
import {useStudentStore} from "@/stores/studentInfo.js";
import Dialog from "@/components/UI/Dialog.vue";
import CurriculumForm from "@/components/Forms/CurriculumForm.vue";

const curriculaStore = useCurriculaStore();
const curricula = computed(() => curriculaStore.curricula)
const authStore = useAuthStore()
const studentStore = useStudentStore()
const studentCurriculum = computed(() => studentStore.curriculumId);

onMounted (async () => {
  if (authStore.userInfo.role !== "STUDENT") {
    await curriculaStore.fetchCurricula();
  }
  document.body.classList.add('table-page');
})

onUnmounted(() => {
  document.body.classList.remove('table-page');
});

const router = useRouter();
const addCurriculumDialogVisible = ref(false)

const showCurriculumAddDialog = () => {
  addCurriculumDialogVisible.value = true;
}

const addCurriculum = (curriculum) => {
  curriculaStore.addCurriculum(curriculum)
  addCurriculumDialogVisible.value = false;
}

const searchQuery = ref('');

const filteredCurricula = computed(() => {
  return curricula.value.filter(curriculum => {
    if (authStore.userInfo.role === 'ADMIN' || authStore.userInfo.role === 'TEACHER') {
      return curriculum.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    }
    return curriculum.access && curriculum.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

</script>

<template>
    <div>
        <h1>Обучение</h1>
        <div class="my-3">
          <input
              type="text"
              v-model="searchQuery"
              class="my-input"
              placeholder="Поиск по названию..."
          />
          <div v-if="authStore.userInfo.role === 'ADMIN' || authStore.userInfo.role === 'TEACHER'">
            <div v-if="filteredCurricula.length > 0">
              <Card v-for="curriculum in filteredCurricula" :key="curriculum.id"
                    @click="router.push(`/curricula/${curriculum.id}`)"
                    :title="curriculum.name">
                <template #caption>
                  <div>
                    <p>{{ curriculum.description }}</p>
                    <p v-if="!curriculum.access" class="bg-warnColor px-5 rounded-lg w-fit">Скрыто</p>
                  </div>
                </template>
              </Card>
            </div>
            <div v-else class="my-2">
              <p>Учебные программы отсутствуют</p>
            </div>
            <button v-if="authStore.userInfo.role === 'ADMIN'" class="my-button" @click="showCurriculumAddDialog">Добавить учебную программу</button>
            <Dialog v-model:show="addCurriculumDialogVisible">
              <CurriculumForm @saveCurriculumData="addCurriculum"/>
            </Dialog>

          </div>
          <div v-else>
            <div v-if="studentCurriculum && studentCurriculum.access">
              <Card :key="studentCurriculum.id"
                    @click="router.push(`/curricula/${studentCurriculum.id}`)"
                    :title="studentCurriculum.name">
                <template #caption>
                  <div>
                    <p>{{ studentCurriculum.description }}</p>
                  </div>
                </template>
              </Card>
            </div>
            <div v-else class="my-2">
              <p>Вы не обучаетесь ни на одной учебной программе</p>
            </div>
          </div>
        </div>
    </div>
</template>

<style scoped>

</style>