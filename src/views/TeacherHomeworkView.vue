<script setup>
import {ref, onMounted, shallowRef, computed, onUnmounted} from 'vue'
import {useRoute} from "vue-router";
import HomeworkStructure from "@/components/HomeworkStructureComponent.vue";
import HomeworkAnswers from "@/components/HomeworkAnswersComponent.vue";
import HomeworkSettings from "@/components/HomeworkSettingsComponent.vue";
import {useHomeworkStore} from "@/stores/homework.js";
import {useFilesStore} from "@/stores/files.js";

const tabs = ref([
  {
    name: "Вид",
    component: shallowRef(HomeworkStructure)
  },
  {
    name: "Ответы учеников",
    component: shallowRef(HomeworkAnswers)
  },
  {
    name: "Настройки",
    component: shallowRef(HomeworkSettings)
  },
])

const currentTab = ref(0)
const isLoading = ref(true)

const homeworkStore = useHomeworkStore()
const filesStore = useFilesStore();
const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId

onMounted(async () => {
  try {
    await homeworkStore.fetchHomework(homeworkId)

    if (homework.value.attachments) {
      await Promise.all(homework.value.attachments.map(file =>
          filesStore.fetchFile("homeworks", homeworkId, file)
      ))
      filesStore.refreshFiles()
    }

    currentTab.value = tabs.value[0]
  } catch (error) {
    console.error("Ошибка загрузки задания:", error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  filesStore.clearFiles();
});

const handleArrowNav = (currentIndex, direction) => {
  const newIndex = direction === 'left'
      ? Math.max(0, currentIndex - 1)
      : Math.min(tabs.value.length - 1, currentIndex + 1);

  document.getElementById(`tab-${newIndex}`).focus();
};
</script>

<template>
  <div v-if="isLoading" class="loader-container">
    <div class="loader"></div>
  </div>

  <div v-else-if="homework">
    <h1>{{ homework.name }}</h1>
    <h2 class="sr-only">Навигация по разделам задания</h2>
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
      <component :is="currentTab.component" role="tabpanel"
                 class="border border-tertiary rounded-b-lg bg-formColor p-5"
                 tabindex="0"
      ></component>
    </div>
  </div>
</template>

<style scoped>
.active {
  @apply brightness-95 rounded-t-lg
}
</style>