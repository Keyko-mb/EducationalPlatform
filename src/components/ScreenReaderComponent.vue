<script setup>
import {ref, onMounted, onBeforeUnmount, computed} from 'vue';
import {useThemeStore} from "@/stores/theme.js";

const themeStore = useThemeStore();

const isEnabled = computed({
  get: () => themeStore.screenReaderEnabled,
  set: (value) => themeStore.setScreenReaderEnabled(value),
});

const selectedVoice = computed({
  get: () => themeStore.screenReaderVoice,
  set: (value) => themeStore.setScreenReaderVoice(value),
});

const rate = computed({
  get: () => themeStore.screenReaderRate,
  set: (value) => themeStore.setScreenReaderRate(value),
});

const volume = computed({
  get: () => themeStore.screenReaderVolume,
  set: (value) => themeStore.setScreenReaderVolume(value),
});

const voices = ref([]);
const utterance = ref(null);

function loadVoices() {
  voices.value = speechSynthesis.getVoices();
  if (voices.value.length > 0 && !selectedVoice.value) {
    // Если голос еще не выбран, устанавливаем первый из списка
    selectedVoice.value = voices.value[0].name;
  }
}

function toggleScreenReader() {
  if (!isEnabled.value) {
    // Если диктор выключен, отменяем текущую речь
    speechSynthesis.cancel();
  }
}

function getAriaLabelledBy(element) {
  const ids = element.getAttribute("aria-labelledby") || "";
  if (!ids) return "";
  return ids
      .split(" ")
      .map(id => document.getElementById(id)?.innerText || "")
      .filter(Boolean)
      .join(" ");
}

function getElementText(node) {
  // Если узел текстовый – возвращаем его текстовое содержимое
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.trim();
  }
  // Если узел не является элементом – пропускаем
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  const el = node;
  const ariaLabel = el.getAttribute("aria-label") || "";
  const ariaLabelledBy = getAriaLabelledBy(el);
  const altAttr = el.getAttribute("alt") || "";
  const children = el.children || [];
  const hasChildElements = children.length > 0;

  if (ariaLabel) return ariaLabel;
  if (ariaLabelledBy) return ariaLabelledBy;
  if (altAttr) return altAttr;

  // Для полей форм читаем value или placeholder
  if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
    const formValue = el.value || el.placeholder || el.innerText || "";
    return formValue.trim();
  }
  if (!hasChildElements) return el.innerText.trim();

  // Рекурсивный сбор текста из потомков
  let result = "";
  Array.from(el.childNodes).forEach(child => {
    const childText = getElementText(child);
    if (childText) {
      result += (result ? " " : "") + childText;
    }
  });
  return result.trim();
}

function handleFocus(event) {
  if (!isEnabled.value) return;

  const element = event.target;
  const textToSpeak = getElementText(element).trim();
  if (textToSpeak) {
    speakText(textToSpeak);
  }
}

function speakText(text) {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  utterance.value = new SpeechSynthesisUtterance(text);
  const voice = voices.value.find(v => v.name === selectedVoice.value);
  if (voice) {
    utterance.value.voice = voice;
  }
  utterance.value.rate = rate.value;
  utterance.value.volume = volume.value;
  speechSynthesis.speak(utterance.value);
}

function setVoice() {
  setSpeechSettings();
}

function setSpeechSettings() {
  if (utterance.value) {
    utterance.value.rate = rate.value;
    utterance.value.volume = volume.value;
  }
}

function removeConsecutiveDuplicates(array) {
  if (!array.length) return [];
  const filtered = [array[0]];
  for (let i = 1; i < array.length; i++) {
    if (array[i] !== array[i - 1]) {
      filtered.push(array[i]);
    }
  }
  return filtered;
}

function traverse(node, results = []) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text) results.push(text);
    return results;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node;
    const ariaLabel = el.getAttribute("aria-label") || "";
    const ariaLabelledBy = getAriaLabelledBy(el);
    const altAttr = el.getAttribute("alt") || "";
    const hasChildElements = el.children?.length > 0;

    if (ariaLabel) {
      results.push(ariaLabel);
      return results;
    }
    if (ariaLabelledBy) {
      results.push(ariaLabelledBy);
      return results;
    }
    if (altAttr) {
      results.push(altAttr);
      return results;
    }
    if (!hasChildElements) {
      const text = el.innerText.trim();
      if (text) results.push(text);
      return results;
    }
    Array.from(node.childNodes).forEach(child => traverse(child, results));
    return results;
  }
  return results;
}

function readPage() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const mainContent = document.querySelector("#main-content");
  if (!mainContent) {
    speakText("Основной контент не найден.");
    return;
  }
  const allTexts = [];
  traverse(mainContent, allTexts);
  const filteredTexts = removeConsecutiveDuplicates(allTexts);
  const finalText = filteredTexts.join(" ").trim() || "Основной контент отсутствует.";
  speakText(finalText);
}

onMounted(() => {
  loadVoices();
  document.addEventListener("focusin", handleFocus, true);
  speechSynthesis.onvoiceschanged = loadVoices;
});

onBeforeUnmount(() => {
  document.removeEventListener("focusin", handleFocus, true);
});
</script>

<template>
  <div class="flex flex-col gap-2 max-w-40"> <!-- Тумблер включения/выключения диктора -->
    <label
        :aria-controls="'screen-reader-dropdown'" class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox"
             v-model="isEnabled"
             @change="toggleScreenReader"
             aria-label="Включить или выключить экранный диктор"
             class="my-input"/>
      <span>Вкл.</span>
    </label>

    <!-- Выпадающее меню настроек -->
    <transition name="fade">
      <div v-if="isEnabled"
           id="screen-reader-dropdown"
           class="border border-tertiary p-3 rounded-lg flex flex-col gap-2"
           role="region"
           aria-label="Настройки экранного диктора">

        <!-- Выбор голоса -->
        <div class="flex flex-col">
          <label for="voice-select" class="mb-1">Голос</label>
          <select id="voice-select"
                  class="my-select"
                  v-model="selectedVoice"
                  @change="setVoice"
                  aria-label="Выберите голос">
            <option
                v-for="voice in voices"
                :key="voice.name"
                :value="voice.name">
              {{ voice.name }}
            </option>
          </select>
        </div>

        <!-- Скорость чтения (rate) -->
        <div class="flex flex-col">
          <label for="rate-label" class="mb-1">Скорость</label>
          <input id="rate"
                 type="range"
                 :aria-label='"Скорость диктора" + rate'
                 min="0.5"
                 max="2"
                 step="0.1"
                 v-model.number="rate"
                 @input="setSpeechSettings"/>
          <span class="sr-only">Текущая скорость: {{ rate }}</span>
        </div>

        <!-- Громкость (volume) -->
        <div class="flex flex-col" aria-labelledby="volume-label">
          <label for="volume" class="mb-1">Громкость</label>
          <input id="volume"
                 type="range"
                 :aria-label='"Громкость диктора" + volume'
                 min="0"
                 max="1"
                 step="0.1"
                 v-model.number="volume"
                 @input="setSpeechSettings"/>
          <span class="sr-only">Текущая громкость: {{ volume }}</span>
        </div>

        <!-- Кнопка для чтения всего текста на странице -->
        <button
            class="bg-bgColor py-2 rounded-lg shadow-md transition duration-300 hover:brightness-110 border border-tertiary"
            @click="readPage"
            aria-label="Читать весь текст на странице">
          Читать страницу
        </button>
      </div>
    </transition>
  </div>
</template>
