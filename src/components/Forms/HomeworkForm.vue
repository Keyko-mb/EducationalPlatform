<script setup>
import {defineEmits, defineProps, ref} from "vue";

const props = defineProps(['homework'])
const homework = ref({ ...props.homework });
const emit = defineEmits(['saveHomeworkData'])

const emitHomeworkData = () => {
  emit('saveHomeworkData', homework.value)
}

</script>

<template>
  <div>
    <div class="space-y-5">
      <h1>Урок</h1>
      <div>
        <p>Название</p>
        <input class="my-input w-full" type="text" id="name" v-model="homework.name">
      </div>
      <div>
        <p>Описание</p>
        <textarea class="my-input w-full" type="text" id="surname" v-model="homework.description"/>
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