<script setup>
import { ref } from 'vue';
import { useThemeStore } from '@/stores/theme.js';

const themeStore = useThemeStore();

const isSerif = ref(false);
const imgHiddenFlag = ref(false);

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
    <div class="flex gap-16 items-center">

      <div class="flex gap-3 items-center flex-col" id="font-size-label">
        <span>Размер шрифта</span>
        <div class="flex gap-4">
          <button class="w-8 h-8 flex items-center justify-center border border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-75"
                  aria-label="Обычный размер шрифта"
                  @click="setFontSize('normal')">
            <span class="text-base" aria-hidden="true">A</span>
          </button>
          <button class="w-8 h-8 flex items-center justify-center border border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-75"
                  aria-label="Увеличенный размер шрифта"
                  @click="setFontSize('large')">
            <span class="text-2xl" aria-hidden="true">A</span>
          </button>
          <button class="w-8 h-8 flex items-center justify-center border border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-75"
                  aria-label="Большой размер шрифта"
                  @click="setFontSize('xlarge')">
            <span class="text-4xl" aria-hidden="true">A</span>
          </button>
        </div>
      </div>

      <div class="flex gap-4 items-center flex-col" id="letter-spacing-container">
        <span>Межбуквенный интервал</span>
        <div aria-labelledby="letter-spacing-container" class="flex gap-4">
          <button class="px-2 border border-tertiary rounded-lg tracking-[0rem] shadow-sm transition duration-300 hover:brightness-75"
                  @click="setLetterSpacing('normal')"
                  aria-label="Обычный межбуквенный интервал">Обычный</button>
          <button class="px-2 border border-tertiary rounded-lg tracking-[.1rem] shadow-sm transition duration-300 hover:brightness-75"
                  @click="setLetterSpacing('large')"
                  aria-label="Средний межбуквенный интервал">Средний</button>
          <button class="px-2 border border-tertiary rounded-lg tracking-[.2rem] shadow-sm transition duration-300 hover:brightness-75"
                  @click="setLetterSpacing('xlarge')"
                  aria-label="Большой межбуквенный интервал">Большой</button>
        </div>
      </div>

      <div class="flex gap-4 items-center flex-col" id="line-height-container">
        <span>Межстрочный интервал</span>
        <div aria-labelledby="line-height-container" class="flex gap-4">
          <button class="px-2 border border-tertiary rounded-lg leading-[1.5rem] shadow-sm transition duration-300 hover:brightness-75"
                  @click="setLineHeight('normal')"
                  aria-label="Обычный межстрочный интервал">Обычный</button>
          <button class="px-2 border border-tertiary rounded-lg leading-[1.75rem] shadow-sm transition duration-300 hover:brightness-75"
                  @click="setLineHeight('large')"
                  aria-label="Средний межстрочный интервал">Средний</button>
          <button class="px-2 border border-tertiary rounded-lg leading-[2rem] shadow-sm transition duration-300 hover:brightness-75"
                  @click="setLineHeight('xlarge')"
                  aria-label="Большой межстрочный интервал">Большой</button>
        </div>
      </div>

      <div class="flex gap-5 items-center flex-col">
        <label for="serif-font">Шрифт с засечками</label>
          <div>
            <input
                type="checkbox"
                id="serif-font"
                v-model="isSerif"
                @change="setSerif"
                aria-label="Включить шрифт с засечками">
            <span> Вкл. </span>
          </div>
      </div>

      <div class="flex gap-3 items-center flex-col">
        <span id="theme-label">Цветовая схема</span>
        <div aria-labelledby="theme-label" class="flex space-x-4">
          <label
              class="w-8 h-8 bg-white border cursor-pointer border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-110"
              title="Светлая тема">
            <input
                type="radio"
                name="theme"
                class="hidden"
                value="light"
                @click="setTheme('light')"
                aria-label="Светлая тема">
          </label>
          <label
              class="w-8 h-8 bg-black border cursor-pointer border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-110"
              title="Темная тема">
            <input
                type="radio"
                name="theme"
                class="hidden"
                value="dark"
                @click="setTheme('dark')"
                aria-label="Темная тема">
          </label>
          <label
              class="w-8 h-8 border cursor-pointer border-tertiary rounded-lg shadow-sm transition duration-300 hover:brightness-110"
              style="background-color: #9DD1FF;"
              title="Голубая тема">
            <input
                type="radio"
                name="theme"
                class="hidden"
                value="blue"
                @click="setTheme('blue')"
                aria-label="Голубая тема">
          </label>
        </div>
      </div>

      <div class="flex gap-5 items-center flex-col">
        <label for="img-hiding">Скрыть изображения</label>
        <div>
          <input
              type="checkbox"
              id="img-hiding"
              v-model="imgHiddenFlag"
              @change="setImgHiding"
              aria-label="Отключить изображения">
          <span> Вкл. </span>
        </div>
      </div>
    </div>
</template>