<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import Classroom from "@/components/UI/Classroom.vue";
import ClassroomForm from "@/components/Forms/ClassroomForm.vue";
import Dialog from "@/components/UI/Dialog.vue";

const classrooms = ref([])
const addClassroomDialogVisible = ref(false)
const isLoading = ref(true)

const currentPage = ref(0);
const pageSize = ref(10);
const totalPages =  ref(0);

const fetchClassrooms = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get("classrooms/paginated", {
      params: {
        offset: currentPage.value,
        pageSize: pageSize.value,
      }
    });
    classrooms.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Ошибка при загрузке учебных групп:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  document.body.classList.add('table-page');
  await fetchClassrooms();
})

onUnmounted(() => {
  document.body.classList.remove('table-page');
});

const handlePageChange = async (pageNumber) => {
  if (pageNumber >= 0 && pageNumber < totalPages.value) {
    currentPage.value = pageNumber;
    await fetchClassrooms();
  }
};

const showAddClassroomDialog = () => {
  addClassroomDialogVisible.value = true;
}

const addClassroom = async (classroom) => {
  try {
    isLoading.value = true;
    const response = await axios.post("classrooms", classroom);
    const currentId = response.data.id;

    classrooms.value.push(classroom);

    await Promise.all(classroom.persons.map(async (student) => {
      await axios.put(`classrooms/${currentId}/students/${student.id}`);
      const classIndex = classrooms.value.findIndex(c => c.id === currentId);
      if (classIndex !== -1) {
        classrooms.value[classIndex].persons = [
          ...(classrooms.value[classIndex].persons || []),
          student
        ];
      }
    }));

  } catch (error) {
    console.error("Error creating classroom:", error);
  } finally {
    isLoading.value = false;
    addClassroomDialogVisible.value = false;
  }
};

const editClassroom = async (updatedClassroom) => {
  try {
    isLoading.value = true;
    await axios.put(`classrooms/${updatedClassroom.id}`, updatedClassroom);
    const index = classrooms.value.findIndex(c => c.id === updatedClassroom.id);
    if (index !== -1) {
      classrooms.value[index] = { ...updatedClassroom };
    }
  } catch (error) {
    console.error("Ошибка при обновлении группы:", error);
  } finally {
    isLoading.value = false;
  }
}

const deleteClassroom = async (id) => {
  try {
    isLoading.value = true;
    await axios.delete(`classrooms/${id}`);
    const index = classrooms.value.findIndex(c => c.id === id);
    if (index !== -1) {
      classrooms.value.splice(index, 1);
    }
  } catch (error) {
    console.error("Ошибка при удалении группы:", error);
  } finally {
    isLoading.value = false;
  }
}

const searchQuery = ref('');

const filteredClassrooms = computed(() => {
  return classrooms.value.filter(classroom =>
      classroom.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const visiblePages = computed(() => {
  const maxVisible = 10;
  const pages = [];
  const total = totalPages.value;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    const half = Math.floor(maxVisible / 2);
    let start = currentPage.value + 1 - half;
    start = start < 1 ? 1 : start;
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = end - maxVisible + 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);
  }
  return pages;
});
</script>

<template>
  <div>
    <h1>Учебные группы</h1>
    <div class="flex flex-col lg:flex-row gap-2 justify-between mt-3 mb-5">
      <label for="search-classroom" class="sr-only">Форма для поиска учебных групп</label>
      <input
          id="search-classroom"
          type="text"
          v-model="searchQuery"
          class="my-input min-w-80"
          placeholder="Поиск группы по названию..."
      />
      <button class="my-button" @click="showAddClassroomDialog">Добавить группу</button>
    </div>

    <div v-if="filteredClassrooms.length > 0" role="list">
      <div v-for="classroom in filteredClassrooms"
           :key="classroom.id" role="listitem">
        <Classroom :classroom="classroom"
                   @deleteClassroom="deleteClassroom"
                   @editClassroom="editClassroom"
        />
      </div>
    </div>
    <div v-else class="my-2">
      <p>Учебные группы не найдены</p>
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

    <Dialog v-model:show="addClassroomDialogVisible" aria-labelledby="dialog-title">
      <h2 id="dialog-title" class="sr-only">Окно для создания новой учебной группы</h2>
      <ClassroomForm @saveClassroomData="addClassroom"/>
    </Dialog>
  </div>
</template>
