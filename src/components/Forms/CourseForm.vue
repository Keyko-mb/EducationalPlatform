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
  <div class="mt-2 space-y-2">
    <h1>Раздел</h1>
    <div>
      <p>Название раздела</p>
      <input class="my-input w-full" type="text" id="name" v-model="course.name" value="">
    </div>
    <div>
      <p>Описание раздела</p>
      <textarea class="my-input w-full min-h-52" type="text" id="caption" v-model="course.description"/>
    </div>
    <div>
      <p>Доступность</p>
      <div class="flex gap-1">
        <input type="checkbox" id="access" v-model="course.access"/>
        <p>Доступно ученикам</p>
      </div>
    </div>
    <div class="flex gap-5 items-center mt-5">
      <button class="my-button" @click="emitCourseData">Сохранить</button>
    </div>
  </div>
</template>

<style scoped>

</style>