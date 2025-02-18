<script setup>

import {useAnswerStore} from "@/stores/answer.js";
import {onUnmounted} from "vue";
import { defineEmits, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const answerStore = useAnswerStore()
const files = ref(answerStore.decodedFiles);

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
  document.addEventListener("keydown", trapFocus);

  if (props.answer && props.answer.attachments) {
    for (const file of props.answer.attachments) {
      answerStore.fetchFile(props.answer.id, file)
    }
    answerStore.refreshFiles();
  }
})

onUnmounted(() => {
  answerStore.clearAnswer();
});

const props = defineProps(["show", "answer"]);
const emit = defineEmits(["hideDialog", "update:show"]);

const dialogRef = ref(null);
const previouslyFocusedElement = ref(null);
const mouseDownInside = ref(false);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);
  document.removeEventListener("keydown", trapFocus);
});

const handleEscape = (event) => {
  if (event.key === "Escape" && props.show) {
    emitHideDialog();
  }
};

const trapFocus = (event) => {
  if (!dialogRef.value) return;
  const focusableElements = dialogRef.value?.querySelectorAll(
      "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );

  if (focusableElements.length === 0) {
    event.preventDefault();
    dialogRef.value.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === "Tab") {
    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
};

const emitHideDialog = () => {
  emit("update:show", false);
  previouslyFocusedElement.value?.focus();
};

const handleMouseDown = (event) => {
  mouseDownInside.value = dialogRef.value.contains(event.target);
};

const handleMouseUp = (event) => {
  if (!mouseDownInside.value && !dialogRef.value.contains(event.target)) {
    emitHideDialog();
  }
};

watch(
    () => props.show,
    (newVal) => {
      if (newVal) {
        previouslyFocusedElement.value = document.activeElement;
        nextTick(() => {
          const focusableElements = dialogRef.value?.querySelectorAll(
              "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            dialogRef.value?.focus();
          }
        });
      }
    }
);
</script>

<template>
  <div
      class="bg-black/50 flex fixed inset-x-0 inset-y-0"
      v-if="show"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
  >
    <div
        @click.stop
        class="-inset-x-60 -inset-y-96 sm:inset-0 md:inset-0 lg:inset-0 m-auto max-h-[52rem] min-w-sm max-w-[1100px] border border-tertiary rounded-lg p-5 bg-bgColor relative overflow-y-auto"
        ref="dialogRef"
        tabindex="-1">
      <input
          @click="emitHideDialog"
          type="image"
          alt="Закрыть окно"
          src="/delete.svg"
          class="absolute right-3 top-3 cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"
          aria-label="Закрыть окно"
      />
      <h1 id="dialog-title" class="sr-only">Диалоговое окно</h1>
        <div>
          <h1 class="my-2">Вложения к ответу</h1>
          <div class="border rounded-lg max-h-96 flex-wrap overflow-y-auto bg-formColor p-4 flex gap-4" role="list">
            <div
                v-for="(file, index) in files"
                :key="'file-' + index"
                class="flex items-center mb-2"
                role="listitem">
              <div v-if="file.type.startsWith('image')" class="relative">
                <img :src="file.url" :alt="'Изображение ' + (index + 1)" class="rounded-lg max-w-80" />
              </div>

              <div v-else class="flex h-full w-full px-2 py-1 rounded-lg border border-tertiary ">
                <a :href="file.url"
                   :download="'file-' + index"
                   class="hover:opacity-75 transition-all underline flex-grow p-2">Скачать файл {{ index + 1 }}</a>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

</style>