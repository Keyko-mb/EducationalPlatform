<script>
export default {
  name: "ScreenReaderSettings",
  data() {
    return {
      isEnabled: false,
      voices: [],
      selectedVoice: "",
      rate: 1,
      volume: 1,
      utterance: null,
    };
  },
  mounted() {
    this.loadVoices();
    document.addEventListener("focusin", this.handleFocus, true);
    speechSynthesis.onvoiceschanged = this.loadVoices;
  },
  beforeUnmount() {
    document.removeEventListener("focusin", this.handleFocus, true);
  },
  methods: {
    loadVoices() {
      this.voices = speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.selectedVoice = this.voices[0].name;
      }
    },
    toggleScreenReader() {
      if (!this.isEnabled) {
        speechSynthesis.cancel();
      }
    },
    handleFocus(event) {
      if (!this.isEnabled) return;

      const element = event.target;
      const textToSpeak = getElementText(element).trim();
      if (textToSpeak) {
        this.speakText(textToSpeak);
      }

      // --- Функция, которая собирает текст в приоритетном порядке:
      function getElementText(node) {
        // 1. Текстовый узел
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim();
        }

        // 2. Если это не ELEMENT_NODE (например, комментарий), ничего не читаем
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return "";
        }

        // 3. Работаем с элементом
        const el = node;
        const ariaLabel = el.getAttribute("aria-label") || "";
        const ariaLabelledBy = getAriaLabelledBy(el);
        const altAttr = el.getAttribute("alt") || "";
        const children = el.children || [];
        const hasChildElements = children.length > 0;

        // a) Если есть aria-label – читаем и не углубляемся
        if (ariaLabel) {
          return ariaLabel;
        }
        // b) Если есть aria-labelledby – читаем и не углубляемся
        if (ariaLabelledBy) {
          return ariaLabelledBy;
        }
        // c) Если есть alt – читаем и не углубляемся
        if (altAttr) {
          return altAttr;
        }

        // d) Для полей форм (input/textarea/select) часто важны value, placeholder
        if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
          // При фокусе логично прочесть value или placeholder
          const formValue = el.value || el.placeholder || el.innerText || "";
          return formValue.trim();
        }

        // e) Если нет дочерних элементов-элементов, читаем собственный текст
        if (!hasChildElements) {
          return el.innerText.trim();
        }

        // f) Если есть вложенные элементы, не берём родительский innerText (который включает текст детей),
        //    а рекурсивно читаем потомков
        let result = "";
        el.childNodes.forEach(child => {
          const childText = getElementText(child);
          if (childText) {
            // Добавим пробел для разделения
            result += (result ? " " : "") + childText;
          }
        });
        return result.trim();
      }

      // --- Утилита для чтения aria-labelledby
      function getAriaLabelledBy(element) {
        const ids = element.getAttribute("aria-labelledby") || "";
        if (!ids) return "";
        return ids
            .split(" ")
            .map(id => document.getElementById(id)?.innerText || "")
            .filter(Boolean)
            .join(" ");
      }
    },

    speakText(text) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      this.utterance = new SpeechSynthesisUtterance(text);
      const voice = this.voices.find((v) => v.name === this.selectedVoice);
      if (voice) this.utterance.voice = voice;
      this.utterance.rate = this.rate;
      this.utterance.volume = this.volume;
      speechSynthesis.speak(this.utterance);
    },
    setVoice() {
      this.setSpeechSettings();
    },
    setSpeechSettings() {
      if (this.utterance) {
        this.utterance.rate = this.rate;
        this.utterance.volume = this.volume;
      }
    },
    readPage() {
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
        }

        const mainContent = document.querySelector("#main-content");
        if (!mainContent) {
          this.speakText("Основной контент не найден.");
          return;
        }

        // Получаем текст из aria-labelledby
        const getAriaLabelledBy = (element) => {
          const ids = element.getAttribute?.("aria-labelledby");
          if (!ids) return "";
          return ids
              .split(" ")
              .map(id => document.getElementById(id)?.innerText || "")
              .filter(Boolean)
              .join(" ");
        };

        // Убираем *подряд* идущие повторения
        // (если хотите убрать все повторения, используйте Set)
        const removeConsecutiveDuplicates = (array) => {
          if (!array.length) return [];
          const filtered = [array[0]];
          for (let i = 1; i < array.length; i++) {
            if (array[i] !== array[i - 1]) {
              filtered.push(array[i]);
            }
          }
          return filtered;
        };

        // Рекурсивная функция обхода
        const traverse = (node, results = []) => {
          // Текстовые узлы:
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) results.push(text);
            return results;
          }

          // Элемент
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node;
            const ariaLabel = el.getAttribute?.("aria-label") || "";
            const ariaLabelledBy = getAriaLabelledBy(el);
            const altAttr = el.getAttribute?.("alt") || "";
            const hasChildElements = el.children?.length > 0;

            // 1) Если есть aria-label -> берём его и НЕ лезем внутрь
            if (ariaLabel) {
              results.push(ariaLabel);
              return results;
            }
            // 2) Если есть aria-labelledby -> берём его и НЕ лезем внутрь
            if (ariaLabelledBy) {
              results.push(ariaLabelledBy);
              return results;
            }
            // 3) Если есть alt -> берём и НЕ лезем внутрь
            if (altAttr) {
              results.push(altAttr);
              return results;
            }

            // 4) Если у элемента нет детей-элементов, берём его innerText
            if (!hasChildElements) {
              const text = el.innerText.trim();
              if (text) results.push(text);
              return results;
            }

            // 5) Если есть дети, не читаем сам el.innerText, а рекурсивно обходим детей
            node.childNodes.forEach(child => traverse(child, results));
            return results;
          }

          // Прочие типы узлов
          return results;
        };

        // Собираем текст
        const allTexts = [];
        traverse(mainContent, allTexts);

        // Убираем подряд идущие дубли (при желании уберите это или замените на Set)
        const filteredTexts = removeConsecutiveDuplicates(allTexts);

        // Склеиваем в одну строку
        const finalText = filteredTexts.join(" ").trim() || "Основной контент отсутствует.";

        // Произносим
        this.speakText(finalText);
      },
  },
}
</script>

<template>
  <div class="flex flex-col gap-2 max-w-52">
    <!-- Тумблер включения/выключения диктора -->
    <label :aria-controls="'screen-reader-dropdown'"
           class="flex items-center gap-2 cursor-pointer">
      <input
          type="checkbox"
          v-model="isEnabled"
          @change="toggleScreenReader"
          aria-label="Включить или выключить экранный диктор"
          class="my-input"
      />
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
                  class="border rounded p-1"
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
        <button class="bg-bgColor py-2 rounded-lg shadow-md transition duration-300 hover:brightness-110 border border-tertiary"
                @click="readPage"
                aria-label="Читать весь текст на странице">
          Читать страницу
        </button>
      </div>
    </transition>
  </div>
</template>
