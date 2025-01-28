<script setup>
import {ref, defineEmits} from "vue";

const props = defineProps(['curriculum'])
const curriculum = ref({ ...props.curriculum });
const emit = defineEmits(['saveCurriculumData'])
const isSaved = ref(false)

const emitCurriculumData = () => {
  if (!curriculum.value.access) {
    curriculum.value.access = false
  }
  emit('saveCurriculumData', curriculum.value)
  isSaved.value = true;
  setTimeout(() => {
    isSaved.value = false;
  }, 3000);
}

</script>

<template>
  <form @submit.prevent="emitCurriculumData">
    <h1>Учебная программа</h1>
    <div class="my-5">
      <label for="name">Название  программы</label>
      <input class="my-input w-full" type="text" id="name" v-model="curriculum.name" value="" aria-label="Поле для ввода названия учебной программы">
    </div>
    <div class="mb-3">
      <label for="caption">Описание программы</label>
      <textarea class="my-input w-full min-h-52" id="caption" v-model="curriculum.description" aria-label="Поле для ввода описания учебной программы"/>
    </div>
    <fieldset class="mb-3">
      <legend>Доступность</legend>
      <div class="flex gap-1">
        <input type="checkbox" id="access" v-model="curriculum.access" aria-label="Сделать доступной учебную программу"/>
        <label for="access">Доступно ученикам</label>
      </div>
    </fieldset>

    <div class="flex gap-5 items-center mt-5">
      <button class="my-button active:bg-tertiary" type="submit">Сохранить</button>
      <p v-if="isSaved" class="opacity-80" aria-live="polite">Изменения сохранены</p>
    </div>
  </form>
</template>

<style scoped>

</style>