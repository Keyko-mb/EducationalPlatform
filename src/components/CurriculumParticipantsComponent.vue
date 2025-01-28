<script setup>
import {defineProps, onMounted, ref} from 'vue';
import axios from "axios";
import ClassroomTable from "@/components/UI/ClassroomTable.vue";
import Dialog from "@/components/UI/Dialog.vue";
import ClassroomAddToCurriculumForm from "@/components/Forms/ClassroomAddToCurriculumForm.vue";

const props = defineProps([
  "curriculum",
])

const classrooms = ref([])
const addClassroomDialogVisible = ref(false)

onMounted(() => {
  axios.get(`curricula/${props.curriculum.id}/classrooms`).then((response) => {
    classrooms.value = response.data
  })
})

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

    <Dialog v-model:show="addClassroomDialogVisible" aria-labelledby="add-classroom-title">
      <h2 id="add-classroom-title" class="sr-only">Окно для добавления учебной группы</h2>
      <ClassroomAddToCurriculumForm :currentClassrooms="classrooms" @addClassroom = "addClassroom"/>
    </Dialog>
  </div>
</template>