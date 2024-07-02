<script setup>
import {defineEmits} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps(['homework'])
const emit = defineEmits(['saveHomeworkData'])

const emitHomeworkData = () => {
  console.log(props.homework)
  emit('saveHomeworkData', props.homework)
}
</script>

<template>
  <div>
    <div class="my-5 space-y-5">
      <div>
        <p>Название</p>
        <input class="my-input" type="text" id="name" v-model="props.homework.name">
      </div>
      <div>
        <p>Описание</p>
        <input  class="my-input" type="text" id="surname" v-model="props.homework.description">
      </div>
      <div>
        <p>Текст</p>
        <input  class="my-input" type="email" id="email" v-model="props.homework.content">
      </div>
      <!--    <attachment/>-->
      <!--    <div>-->
      <!--      <p>Доступ</p>-->
      <!--      <select class="my-select" id="role" v-model="props.homework.access">-->
      <!--        <option>Выберите роль</option>-->
      <!--        <option>STUDENT</option>-->
      <!--        <option>TEACHER</option>-->
      <!--      </select>-->
      <!--    </div>-->
    </div>
    <div class="flex gap-5">
      <button class="my-button" @click="emitHomeworkData">Сохранить</button>
      <button class="my-button" @click="router.go(-1)">Отмена</button>
    </div>
  </div>
</template>

<style scoped>

</style>