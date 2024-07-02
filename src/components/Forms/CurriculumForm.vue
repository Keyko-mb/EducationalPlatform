<script setup>

import {ref, defineEmits, onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps(['curriculum'])
const curriculum = props.curriculum ? ref(props.curriculum) : ref({})
const emit = defineEmits(['saveCurriculumData'])
const isSaved = ref(false)

const emitCurriculumData = () => {
  emit('saveCurriculumData', curriculum.value)
  isSaved.value = true
}

</script>

<template>
  <div class="mt-2 space-y-2">
    <div>
      <p>Название курса</p>
      <input class="my-input" type="text" id="name" v-model="curriculum.name" value="">
    </div>
    <div>
      <p>Описание курса</p>
      <input class="my-input" type="text" id="caption" v-model="curriculum.description" value="">
    </div>
    <div>
      <p>Доступность</p>
      <div class="flex gap-1">
        <input type="checkbox" id="access" v-model="curriculum.access"/>
        <p>Доступно ученикам</p>
      </div>
    </div>
    <div class="flex gap-5 items-center mt-5">
      <button class="my-button" @click="emitCurriculumData">Сохранить</button>
      <p v-if="isSaved" class="text-secondary">Изменения сохранены</p>
    </div>
  </div>
</template>

<style scoped>

</style>