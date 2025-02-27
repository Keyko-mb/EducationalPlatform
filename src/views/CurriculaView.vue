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
const studentCurricula = computed(() => studentStore.curricula);

const totalPages = computed(() => curriculaStore.totalPages);
const currentPage = ref(0);
const pageSize = ref(10);
const isLoading = ref(true);

onMounted (async () => {
  try {
    if (authStore.userInfo.role !== "STUDENT") {
      await curriculaStore.fetchCurriculaPaginated(currentPage.value, pageSize.value);
    }
    document.body.classList.add('table-page');
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  } finally {
    isLoading.value = false; // Выключаем лоадер
  }
})

onUnmounted(() => {
  document.body.classList.remove('table-page');
});

const router = useRouter();
const addCurriculumDialogVisible = ref(false)

const handlePageChange = async (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    isLoading.value = true; // Включаем лоадер при смене страницы
    try {
      await curriculaStore.fetchCurriculaPaginated(currentPage.value, pageSize.value);
    } finally {
      isLoading.value = false;
    }
  }
};

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

const visiblePages = computed(() => {
  const maxVisible = 10;
  const pages = [];
  const total = totalPages.value;
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    const half = Math.floor(maxVisible / 2);
    let start = currentPage.value + 1 - half;
    if (start < 1) {
      start = 1;
    }
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = end - maxVisible + 1;
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  return pages;
});
</script>

<template>
  <div>
    <h1>Обучение</h1>
    <div class="my-3">
      <div class="flex flex-col lg:flex-row justify-between gap-2">
        <label for="searchInput" class="sr-only">Поле для поиска учебной программы по названию</label>
        <input
            type="text"
            id="searchInput"
            v-model="searchQuery"
            class="my-input"
            placeholder="Поиск по названию..."
        />
        <button v-if="authStore.userInfo.role === 'ADMIN'" class="my-button" @click="showCurriculumAddDialog">Добавить учебную программу</button>
      </div>

      <div v-if="authStore.userInfo.role === 'ADMIN' || authStore.userInfo.role === 'TEACHER'">
        <h2 class="sr-only" id="homeworks-heading">Список учебных программ</h2>
        <div v-if="filteredCurricula.length > 0" role="list">
          <div v-for="curriculum in filteredCurricula" :key="curriculum.id" role="listitem">
            <Card @click="router.push(`/curricula/${curriculum.id}`)"
                  @keydown.enter="router.push(`/curricula/${curriculum.id}`)"
                  :title="curriculum.name">
              <template #caption>
                <div>
                  <p>{{ curriculum.description }}</p>
                  <p v-if="!curriculum.access" class="access" aria-label="Статус учебной программы">Скрыто</p>
                </div>
              </template>
            </Card>
          </div>
        </div>
        <div v-else class="my-2">
          <p>Учебные программы не найдены</p>
        </div>

        <div class="flex items-center my-4">
          <button
              class="px-3 py-1 border border-tertiary rounded-lg shadow-md bg-formColor transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
              :disabled="currentPage <= 0"
              @click="handlePageChange(currentPage - 1)">
            <
          </button>
          <div class="mx-3 flex space-x-1">
            <span
                v-for="n in visiblePages"
                :key="n"
                @click="handlePageChange(n - 1)"
                class="cursor-pointer px-3 py-1 rounded-lg"
                :class="{
                  'bg-logoColor text-formColor': currentPage + 1 === n,
                  'bg-formColor border border-tertiary': currentPage + 1 !== n
                }">
              {{ n }}
            </span>
          </div>
          <button
              class="px-3 py-1 border border-tertiary rounded-lg shadow-md bg-formColor transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
              :disabled="currentPage >= totalPages - 1"
              @click="handlePageChange(currentPage + 1)">
            >
          </button>
        </div>

        <Dialog v-model:show="addCurriculumDialogVisible" aria-labelledby="dialog-title">
          <h2 id="dialog-title" class="sr-only">Окно для создания новой учебной программы</h2>
          <CurriculumForm @saveCurriculumData="addCurriculum"/>
        </Dialog>
      </div>

      <div v-else>
        <div v-if="studentCurricula" v-for="studentCurriculum in studentCurricula">
          <Card v-if="studentCurriculum.access"
                :key="studentCurriculum.id"
                @click="router.push(`/curricula/${studentCurriculum.id}`)"
                :title="studentCurriculum.name"
                @keydown.enter="router.push(`/curricula/${studentCurriculum.id}`)">
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

