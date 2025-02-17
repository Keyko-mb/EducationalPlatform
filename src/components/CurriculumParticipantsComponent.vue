<script setup>
import {computed, defineProps, onMounted, ref} from 'vue';
import axios from "axios";
import ClassroomTable from "@/components/UI/ClassroomTable.vue";
import Dialog from "@/components/UI/Dialog.vue";
import ClassroomAddToCurriculumForm from "@/components/Forms/ClassroomAddToCurriculumForm.vue";

const props = defineProps([
  "curriculum",
])

const classrooms = ref([])
const addClassroomDialogVisible = ref(false)

const currentPage = ref(0);
const pageSize = ref(10);
const totalPages =  ref(0);

const fetchClassrooms = () => {
  axios
      .get(`curricula/${props.curriculum.id}/classrooms/paginated`, {
        params: {
          page: currentPage.value,
          size: pageSize.value,
        }
      })
      .then((response) => {
        classrooms.value = response.data.content;
        totalPages.value = response.data.totalPages;
      })
      .catch((error) => {
        console.error("Ошибка при загрузке учебных групп:", error);
      });
};

onMounted(() => {
  fetchClassrooms();
})

const handlePageChange = (pageNumber) => {
  if (pageNumber >= 0 && pageNumber < totalPages.value) {
    currentPage.value = pageNumber;
    fetchClassrooms();
  }
};

const showClassroomAddDialog = () => {
  addClassroomDialogVisible.value = true;
}

const addClassroom = (classroom) => {
  axios.put(`classrooms/${classroom.value.id}/curriculum/${props.curriculum.id}`)
      .then(response => classrooms.value.push(response.data))
  addClassroomDialogVisible.value = false
}

const deleteClassroom = (classroomId) => {
  axios.delete(`classrooms/${classroomId}/curriculum/${props.curriculum.id}`)
  classrooms.value = classrooms.value.filter(classroom => classroom.id !== classroomId)
}

const visiblePages = computed(() => {
  const maxVisible = 10;
  const pages = [];
  const total = totalPages.value;
  // Если количество страниц меньше или равно максимальному количеству отображаемых элементов, // возвращаем все страницы
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Определяем диапазон так, чтобы currentPage была примерно по центру
    const half = Math.floor(maxVisible / 2);
    let start = currentPage.value + 1 - half; // +1, т.к. currentPage начинается с 0
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
  <div class="flex flex-col" aria-labelledby="classroom-list-heading">
    <div class="flex justify-between items-center mb-5">
      <h1>Список учебных групп</h1>
      <button class="my-button" @click="showClassroomAddDialog">Добавить группу</button>
    </div>
    <div role="list">
      <ClassroomTable v-if="classrooms.length > 0" class="w-full mb-5" v-for="classroom in classrooms"
                      :key="classroom.id"
                      :classroom="classroom"
                      :users="classroom.persons"
                      @deleteClassroom="deleteClassroom"
                      role="listitem"/>
      <div v-else>
        <p>Учебные группы отсутствуют</p>
      </div>
    </div>

    <div class="flex items-center justify-center my-4">
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

    <Dialog v-model:show="addClassroomDialogVisible" aria-labelledby="add-classroom-title">
      <h2 id="add-classroom-title" class="sr-only">Окно для добавления учебной группы</h2>
      <ClassroomAddToCurriculumForm :currentClassrooms="classrooms" @addClassroom = "addClassroom"/>
    </Dialog>
  </div>
</template>