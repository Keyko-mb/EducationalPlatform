<script setup>
import {ref, onMounted, shallowRef} from 'vue'
import CurriculumStructure from '../components/CurriculumStructureComponent.vue'
import CurriculumParticipants from '../components/CurriculumParticipantsComponent.vue'
import CurriculumSettings from '../components/CurriculumSettingsComponent.vue'
import {useRoute} from "vue-router";
import axios from "axios";

const tabs = ref([
  {
    name: "Структура",
    component: shallowRef(CurriculumStructure)
  },
  {
    name: "Участники",
    component: shallowRef(CurriculumParticipants)
  },
  {
    name: "Настройки",
    component: shallowRef(CurriculumSettings)
  },
])

const currentTab = ref(0)
const curriculum = ref({})
const id = useRoute().params.id
const isLoading = ref(true)

onMounted(async () => {
  try {
    currentTab.value = tabs.value[0]
    const response = await axios.get(`curricula/${id}`)
    curriculum.value = response.data
  } catch (error) {
    console.error("Ошибка загрузки программы:", error)
  } finally {
    isLoading.value = false
  }
})

const updateCurriculum = (updatedCurriculum) => {
  curriculum.value = updatedCurriculum;
}

const handleArrowNav = (currentIndex, direction) => {
  const newIndex = direction === 'left'
      ? Math.max(0, currentIndex - 1)
      : Math.min(tabs.value.length - 1, currentIndex + 1);

  document.getElementById(`tab-${newIndex}`).focus();
};
</script>

<template>
  <div>
    <h1>{{ curriculum.name }}</h1>
    <h2 class="sr-only">Навигация по настройкам учебной программы</h2>
    <div class="my-5" role="navigation">
      <div role="tablist" aria-orientation="horizontal" class="flex">
        <button
            v-for="(tab, index) in tabs"
            :key="tab.name"
            :id="`tab-${index}`"
            role="tab"
            :aria-selected="currentTab.name === tab.name"
            :aria-controls="`tabpanel-${index}`"
            :class="['border-t border-l border-r border-tertiary px-4 py-2 rounded-t-lg hover:brightness-95 bg-formColor', { active: currentTab.name === tab.name }]"
            @click="currentTab = tab"
            @keydown.left.prevent="handleArrowNav(index, 'left')"
            @keydown.right.prevent="handleArrowNav(index, 'right')">
          {{ tab.name }}
        </button>
      </div>
      <component
          :is="currentTab.component"
          class="border border-tertiary rounded-b-lg bg-formColor p-5"
          :curriculum="curriculum"
          @updateCurriculum="updateCurriculum"
      ></component>
    </div>
  </div>
</template>


<style scoped>
.active {
  @apply brightness-95 rounded-t-lg
}
</style>