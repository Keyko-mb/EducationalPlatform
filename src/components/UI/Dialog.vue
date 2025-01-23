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
        class="m-auto max-h-[52rem] min-w-[600px] max-w-[1100px] border border-tertiary rounded-lg p-5 bg-bgColor relative overflow-y-auto"
        ref="dialogRef"
        tabindex="-1"
    >
      <input
          @click="emitHideDialog"
          type="image"
          alt="Закрыть окно"
          src="/delete.svg"
          class="absolute right-3 top-3 cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"
      />
      <h2 id="dialog-title" class="sr-only">Диалоговое окно</h2>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps(["show"]);
const emit = defineEmits(["hideDialog", "update:show"]);

const dialogRef = ref(null);
const previouslyFocusedElement = ref(null);
const mouseDownInside = ref(false);

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
  document.addEventListener("keydown", trapFocus);
});

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
