<script setup>
import {defineEmits, defineProps, onMounted, ref, watch} from "vue";

const props = defineProps(['homework'])
const homework = props.homework ? ref(props.homework) : ref({})
const emit = defineEmits(['saveHomeworkData'])

const emitHomeworkData = () => {
  emit('saveHomeworkData', homework.value)
}

</script>

<template>
  <div>
    <div class="my-5 space-y-5">
      <h1>Задание</h1>
      <div>
        <p>Название</p>
        <input class="my-input" type="text" id="name" v-model="homework.name">
      </div>
      <div>
        <p>Описание</p>
        <input  class="my-input" type="text" id="surname" v-model="homework.description">
      </div>
      <!--    <attachment/>-->
<!--      <div>-->
<!--        <p>Доступность</p>-->
<!--        <div class="flex gap-1">-->
<!--          <input type="checkbox" id="access" v-model="homework.access"/>-->
<!--          <p>Доступно ученикам</p>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="flex gap-5 items-center mt-5">
      <button class="my-button" @click="emitHomeworkData">Сохранить</button>
    </div>
  </div>
</template>

<style scoped>

</style>