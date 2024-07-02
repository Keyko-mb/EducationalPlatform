<script setup>
import {defineEmits} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps(['lesson'])
const emit = defineEmits(['saveLessonData'])

const emitLessonData = () => {
  console.log(props.lesson)
  emit('saveLessonData', props.lesson)
}

</script>

<template>
<div>
  <div class="my-5 space-y-5">
    <div>
      <p>Название</p>
      <input class="my-input" type="text" id="name" v-model="props.lesson.name">
    </div>
    <div>
      <p>Описание</p>
      <input  class="my-input" type="text" id="surname" v-model="props.lesson.description">
    </div>
    <div>
      <p>Текст</p>
      <input  class="my-input" type="email" id="email" v-model="props.lesson.content">
    </div>
<!--    <attachment/>-->
<!--    <div>-->
<!--      <p>Доступ</p>-->
<!--      <select class="my-select" id="role" v-model="props.lesson.access">-->
<!--        <option>Выберите роль</option>-->
<!--        <option>STUDENT</option>-->
<!--        <option>TEACHER</option>-->
<!--      </select>-->
<!--    </div>-->
  </div>
  <div class="flex gap-5">
    <button class="my-button" @click="emitLessonData">Сохранить</button>
    <button class="my-button" @click="router.go(-1)">Отмена</button>
  </div>
</div>
</template>

<style scoped>

</style>