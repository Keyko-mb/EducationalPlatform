<script setup>
import {defineEmits, ref, watch} from "vue";

const props = defineProps(['lesson'])
const lesson = props.lesson ? ref(props.lesson) : ref({})
const emit = defineEmits(['saveLessonData'])

const emitLessonData = () => {
  emit('saveLessonData', lesson.value)
}
</script>

<template>
<div>
  <div class="my-5 space-y-5">
    <h1>Урок</h1>
    <div>
      <p>Название</p>
      <input class="my-input" type="text" id="name" v-model="lesson.name">
    </div>
    <div>
      <p>Описание</p>
      <input  class="my-input" type="text" id="surname" v-model="lesson.description">
    </div>
    <div>
      <p>Текст</p>
      <input  class="my-input" type="email" id="email" v-model="lesson.content">
    </div>
<!--    <attachment/>-->
    <div>
      <p>Доступность</p>
      <div class="flex gap-1">
        <input type="checkbox" id="access" v-model="lesson.access"/>
        <p>Доступно ученикам</p>
      </div>
    </div>
  </div>
  <div class="flex gap-5 items-center mt-5">
    <button class="my-button" @click="emitLessonData">Сохранить</button>
  </div>
</div>
</template>

<style scoped>

</style>