<script setup>
import {ref, defineEmits} from "vue";

const props = defineProps(['course'])
const course = props.course ? ref(props.course) : ref({})
const emit = defineEmits(['saveCourseData'])


const emitCourseData = () => {
  if (!course.value.access) {
    course.value.access = false
  }
  emit('saveCourseData', course.value)
}

</script>

<template>
  <form @submit.prevent="emitCourseData">
    <div class="mt-2 space-y-2">
      <h1>Раздел</h1>
      <div>
        <label for="name">Название раздела</label>
        <input class="my-input w-full" type="text" id="name" v-model="course.name" value="" aria-label="Поле для ввода названия раздела">
      </div>
      <div>
        <label for="caption">Описание раздела</label>
        <textarea class="my-input w-full min-h-52" type="text" id="caption" v-model="course.description" aria-label="Поле для ввода описания раздела"/>
      </div>
      <fieldset>
        <legend>Доступность</legend>
        <div class="flex gap-1">
          <input type="checkbox" id="access" v-model="lesson.access"/>
          <label for="access">Доступно ученикам</label>
        </div>
      </fieldset>

      <button class="my-button mt-5" type="submit">Сохранить</button>
    </div>
  </form>
</template>

<style scoped>

</style>