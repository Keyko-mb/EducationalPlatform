<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import Classroom from "@/components/UI/Classroom.vue";
import ClassroomForm from "@/components/Forms/ClassroomForm.vue";
import Dialog from "@/components/UI/Dialog.vue";

const classrooms = ref([])
const addClassroomDialogVisible = ref(false)

onMounted(() => {
  axios.get(`classrooms`).then((response) => {
    classrooms.value = response.data
  });
  document.body.classList.add('table-page');
})

onUnmounted(() => {
  document.body.classList.remove('table-page');
});

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