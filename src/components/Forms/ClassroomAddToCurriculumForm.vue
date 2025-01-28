<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const emit = defineEmits(['addClassroom'])
const props = defineProps(['currentClassrooms'])

const availableClassrooms = ref([])
const newClassroom = ref({})

onMounted(() => {
  axios.get('classrooms').then((response) => {
    availableClassrooms.value = response.data;
    availableClassrooms.value = availableClassrooms.value.filter(classroom => !props.currentClassrooms.some(currClassroom => currClassroom.id === classroom.id));
  })
})


const emitAddClassroom = () => {
  emit('addClassroom', newClassroom)
}

</script>

<template>
  <form @submit.prevent="emitAddClassroom" class="my-5 space-y-5">
    <div class="space-y-2">
      <h3>Выберите учебную группу</h3>

      <label for="select_classroom" class="sr-only">Список учебных групп</label>
      <select class="w-full border border-tertiary rounded-lg bg-formColor p-2" v-model="newClassroom"
              id="select_classroom"
              aria-describedby="select-classroom-help">
        <option selected disabled value="">Выберите учебую группу</option>
        <option v-for="classroom in availableClassrooms" :value="classroom" :key="classroom.id">{{classroom.name}}</option>
      </select>
      <p id="select-classroom-help" class="sr-only">Используйте стрелки для выбора группы, затем нажмите Enter.</p>
    </div>
      <button class="my-button" type="submit">Сохранить</button>
  </form>
</template>

<style scoped>

</style>