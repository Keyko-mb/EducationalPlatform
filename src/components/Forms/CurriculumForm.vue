<script setup>

import {ref, defineEmits} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps(['curriculum'])
const curriculum = ref({ ...props.curriculum });
const emit = defineEmits(['saveCurriculumData'])
const isSaved = ref(false)

const emitCurriculumData = () => {
  emit('saveCurriculumData', curriculum.value)
  isSaved.value = true;
  setTimeout(() => {
    isSaved.value = false;
  }, 3000);
}

</script>

<template>
  <div class="mt-2 space-y-2">
    <h1>Учебная программа</h1>
    <div>
      <p>Название курса</p>
      <input class="my-input w-full" type="text" id="name" v-model="curriculum.name" value="">
    </div>
    <div>
      <p>Описание курса</p>
      <textarea class="my-input w-full min-h-52" type="text" id="caption" v-model="curriculum.description"/>
    </div>
    <div>
      <p>Доступность</p>
      <div class="flex gap-1">
        <input type="checkbox" id="access" v-model="curriculum.access"/>
        <p>Доступно ученикам</p>
      </div>
    </div>
    <div class="flex gap-5 items-center">
      <button class="my-button mt-5" @click="emitCurriculumData">Сохранить</button>
      <p v-if="isSaved" class="opacity-80">Изменения сохранены</p>
    </div>
  </div>
</template>

<style scoped>

</style>