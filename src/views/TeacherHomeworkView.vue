<script setup>
import {ref, onMounted, shallowRef, computed} from 'vue'
import {useRoute} from "vue-router";
import HomeworkStructure from "@/components/HomeworkStructureComponent.vue";
import HomeworkAnswers from "@/components/HomeworkAnswersComponent.vue";
import HomeworkSettings from "@/components/HomeworkSettingsComponent.vue";
import {useHomeworkStore} from "@/stores/homework.js";

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

const homeworkStore = useHomeworkStore()
const homework = computed(() => homeworkStore.homework)
const homeworkId = useRoute().params.homeworkId

onMounted(async () => {
  await homeworkStore.fetchHomework(homeworkId)
  currentTab.value = tabs.value[0]
})

</script>


<template>
  <div v-if="homework">
    <h1>{{homework.name}}</h1>
    <div class="my-5">
      <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="['border-t border-l border-r border-secondary px-4 py-2 rounded-t-lg hover:bg-primary bg-tertiary', { active: currentTab.name === tab.name }]"
          @click="currentTab = tab">
        {{ tab.name }}
      </button>
      <component :is="currentTab.component" class="border border-secondary rounded-b-lg bg-tertiary p-5"></component>
    </div>
  </div>
</template>