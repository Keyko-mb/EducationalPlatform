<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const classrooms = ref([])
const newClassroom = ref({})

onMounted(() => {
  axios.get('classrooms').then((response) => {
    classrooms.value = response.data
  })
})

const emit = defineEmits(['addClassroom'])

const emitAddClassroom = () => {
  emit('addClassroom', newClassroom)
}

</script>

<template>
  <div class="space-y-2">
    <div class="space-y-2">
      <h3>Выберите учебую группу</h3>
      <select class="border border-secondary rounded-lg bg-tertiary p-2" v-model="newClassroom" id="select_classroom">
        <option selected disabled value="">Выберите учебую группу</option>
        <option v-for="classroom in classrooms" :value="classroom" :key="classroom.id">{{classroom.name}}</option>
      </select>
    </div>
      <button class="my-button" @click="emitAddClassroom">Сохранить</button>
  </div>
</template>

<style scoped>

</style>