<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import Classroom from "@/components/UI/Classroom.vue";
import ClassroomForm from "@/components/Forms/ClassroomForm.vue";
import Dialog from "@/components/UI/Dialog.vue";

const classrooms = ref([])
const addClassroomDialogVisible = ref(false)

const currentPage = ref(0);
const pageSize = ref(10);
const totalPages =  ref(0);

const fetchClassrooms = () => {
  axios
      .get("classrooms/paginated", {
        params: {
          offset: currentPage.value,
          pageSize: pageSize.value,
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
  document.body.classList.add('table-page');
})

onUnmounted(() => {
  document.body.classList.remove('table-page');
});

const handlePageChange = (pageNumber) => {
  if (pageNumber >= 0 && pageNumber < totalPages.value) {
    currentPage.value = pageNumber;
    fetchClassrooms();
  }
};

const showAddClassroomDialog = () => {
  addClassroomDialogVisible.value = true;
}

const addClassroom = (classroom) => {
  let currentId = 0;

  axios
      .post("classrooms", classroom)
      .then((response) => {
        classrooms.value.push(classroom);

        currentId = response.data.id;

        classroom.persons.forEach((student) => {
          axios
              .put(`classrooms/${currentId}/students/${student.id}`)
              .then(() => {
                const classIndex = classrooms.value.findIndex(c => c.id === currentId);
                if (classIndex !== -1) {
                  if (!classrooms.value[classIndex].persons) {
                    classrooms.value[classIndex].persons = [];
                  }
                  classrooms.value[classIndex].persons.push(student);
                }
              })
              .catch((error) => {
                console.error(`Error adding student ${student.id}:`, error);
              });
        });
      })
      .catch((error) => {
        console.error("Error creating classroom:", error);
      })
      .finally(() => {
        addClassroomDialogVisible.value = false;
      });
};

const editClassroom = (updatedClassroom) => {
  axios
      .put(`classrooms/${updatedClassroom.id}`, updatedClassroom)
      .then(() => {
        const index = classrooms.value.findIndex(classroom => classroom.id === updatedClassroom.id);
        if (index !== -1) {
          classrooms.value[index] = { ...updatedClassroom };
        }
      })
}

const deleteClassroom = (id) => {
  axios.delete(`classrooms/${id}`)
      .then(() => {
        const index = classrooms.value.findIndex(classroom => classroom.id === id);
        if (index !== -1) {
          classrooms.value.splice(index, 1);
        }
      })
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
  <div>
    <h1>Учебные группы</h1>
    <div class="flex justify-between my-3">
      <label for="search-classroom" class="sr-only">Форма для поиска учебных групп</label>
      <input
          id="search-classroom"
          type="text"
          v-model="searchQuery"
          class="my-input"
          placeholder="Поиск по названию..."
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
      <p>Учебные группы отсутствуют</p>
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

    <div>
      <Dialog v-model:show="addClassroomDialogVisible" aria-labelledby="dialog-title" >
        <h2 id="dialog-title" class="sr-only">Окно для создания новой учебной группы</h2>
        <ClassroomForm @saveClassroomData="addClassroom"/>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>

</style>