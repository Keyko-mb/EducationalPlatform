<script setup>
import {computed, ref} from 'vue';
import { useThemeStore } from '@/stores/theme.js';
import ScreenReaderComponent from "@/components/ScreenReaderComponent.vue";

const themeStore = useThemeStore();

const isSerif = ref(false);
const imgHiddenFlag = ref(false);

const currentTheme = computed(() => themeStore.theme);
const currentFontSize = computed(() => themeStore.fontSize);
const currentLineHeight = computed(() => themeStore.lineHeight);
const currentLetterSpacing = computed(() => themeStore.letterSpacing);

const setSerif = () => {
    if (isSerif.value) {
        themeStore.setFontFamily('serif');
    }
    else {
        themeStore.setFontFamily('Nunito, sans-serif');
    }
}

const setLineHeight = (value) => {
  themeStore.setLineHeight(value);
};

const setLetterSpacing = (value) => {
  themeStore.setLetterSpacing(value);
};

const setFontSize = (size) => {
    themeStore.setFontSize(size);
}

const setTheme = (theme) => {
    themeStore.setTheme(theme);
}

const setImgHiding = () => {
  themeStore.setImgHiding(imgHiddenFlag.value);
}
</script>

<template>
  <div class="flex gap-8 items-center lg:flex-row flex-wrap" aria-labelledby="accessibility-settings-title">
    <h2 id="accessibility-settings-title" class="sr-only">Настройки доступности</h2>

    <div class="flex gap-3 items-center flex-col" aria-labelledby="font-size-label">
      <p id="font-size-label">Размер шрифта</p>
      <div class="flex gap-2">
        <button
            class="w-8 h-8 flex items-center justify-center border border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-75"
            aria-label="Обычный размер шрифта"
            @click="setFontSize('normal')"
            :class="{'ring-2 ring-logoColor': currentFontSize === 'normal'}"
        >
          <span class="text-base" aria-hidden="true">A</span>
        </button>
        <button
            class="w-8 h-8 flex items-center justify-center border border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-75"
            aria-label="Увеличенный размер шрифта"
            @click="setFontSize('large')"
            :class="{'ring-2 ring-logoColor': currentFontSize === 'large'}"
        >
          <span class="text-2xl" aria-hidden="true">A</span>
        </button>
        <button
            class="w-8 h-8 flex items-center justify-center border border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-75"
            aria-label="Большой размер шрифта"
            @click="setFontSize('xlarge')"
            :class="{'ring-2 ring-logoColor': currentFontSize === 'xlarge'}"
        >
          <span class="text-4xl" aria-hidden="true">A</span>
        </button>
      </div>
    </div>

    <div class="flex gap-3 items-center flex-col" aria-labelledby="letter-spacing-label">
      <p id="letter-spacing-label">Межбуквенный интервал</p>
      <div class="flex gap-2">
        <button
            class="px-2 py-1 border border-tertiary rounded-lg tracking-[0rem] shadow-sm transition duration-300 hover:brightness-75"
            @click="setLetterSpacing('normal')"
            aria-label="Обычный межбуквенный интервал"
            :class="{'ring-2 ring-logoColor': currentLetterSpacing === 'normal'}"
        >
          Обычный
        </button>
        <button
            class="px-2 border border-tertiary rounded-lg tracking-[.1rem] shadow-sm transition duration-300 hover:brightness-75"
            @click="setLetterSpacing('large')"
            aria-label="Средний межбуквенный интервал"
            :class="{'ring-2 ring-logoColor': currentLetterSpacing === 'large'}"
        >
          Средний
        </button>
        <button
            class="px-2 border border-tertiary rounded-lg tracking-[.2rem] shadow-sm transition duration-300 hover:brightness-75"
            @click="setLetterSpacing('xlarge')"
            aria-label="Большой межбуквенный интервал"
            :class="{'ring-2 ring-logoColor': currentLetterSpacing === 'xlarge'}"
        >
          Большой
        </button>
      </div>
    </div>

    <div class="flex gap-3 items-center flex-col" aria-labelledby="line-height-label">
      <p id="line-height-label">Межстрочный интервал</p>
      <div class="flex gap-2">
        <button
            class="px-2 border border-tertiary rounded-lg leading-[1.5rem] shadow-sm transition duration-300 hover:brightness-75"
            @click="setLineHeight('normal')"
            aria-label="Обычный межстрочный интервал"
            :class="{'ring-2 ring-logoColor': currentLineHeight === 'normal'}"
        >
          Обычный
        </button>
        <button
            class="px-2 border border-tertiary rounded-lg leading-[1.75rem] shadow-sm transition duration-300 hover:brightness-75"
            @click="setLineHeight('large')"
            aria-label="Средний межстрочный интервал"
            :class="{'ring-2 ring-logoColor': currentLineHeight === 'large'}"
        >
          Средний
        </button>
        <button
            class="px-2 border border-tertiary rounded-lg leading-[2rem] shadow-sm transition duration-300 hover:brightness-75"
            @click="setLineHeight('xlarge')"
            aria-label="Большой межстрочный интервал"
            :class="{'ring-2 ring-logoColor': currentLineHeight === 'xlarge'}"
        >
          Большой
        </button>
      </div>
    </div>

    <div class="flex gap-5 items-center flex-col text-center">
      <p>Шрифт с засечками</p>
      <label for="serif-font" class="flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            id="serif-font"
            v-model="isSerif"
            @change="setSerif"
            aria-label="Включить шрифт с засечками"
        />
        <span>Вкл.</span>
      </label>
    </div>

    <div class="flex gap-3 items-center flex-col text-center" aria-labelledby="theme-label">
      <p id="theme-label">Цветовая схема</p>
      <div class="flex space-x-2">
        <button
            class="w-8 h-8 bg-white border cursor-pointer border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-110"
            aria-label="Светлая тема"
            @click="setTheme('light')"
            :class="{'ring-2 ring-logoColor': currentTheme === 'light'}"
        >
          <span class="sr-only">Светлая тема</span>
        </button>
        <button
            class="w-8 h-8 bg-black border cursor-pointer border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-110"
            aria-label="Темная тема"
            @click="setTheme('dark')"
            :class="{'ring-2 ring-logoColor': currentTheme === 'dark'}"
        >
          <span class="sr-only">Темная тема</span>
        </button>
        <button
            class="w-8 h-8 border cursor-pointer border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-110"
            style="background-color: #9DD1FF;"
            aria-label="Голубая тема"
            @click="setTheme('blue')"
            :class="{'ring-2 ring-logoColor': currentTheme === 'blue'}"
        >
          <span class="sr-only">Голубая тема</span>
        </button>
      </div>
    </div>

    <div class="flex gap-5 items-center flex-col text-center">
      <p>Скрыть изображения</p>
      <label for="img-hiding" class="flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            id="img-hiding"
            v-model="imgHiddenFlag"
            @change="setImgHiding"
            aria-label="Скрыть изображения"
        />
        <span>Вкл.</span>
      </label>
    </div>

    <div class="flex gap-5 items-center flex-col text-center">
      <p>Экранный диктор</p>
      <ScreenReaderComponent />
    </div>
  </div>

</template>