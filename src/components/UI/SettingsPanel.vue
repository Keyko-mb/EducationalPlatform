<script setup>
import { ref } from 'vue';
import { useThemeStore } from '@/stores/theme.js';

const themeStore = useThemeStore();

const isSerif = ref(false);

const setSerif = () => {
    console.log(document.documentElement.style);
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

</script>

<template>
    <div class="flex gap-16 items-center">

      <label class="flex gap-3 items-center flex-col" id="font-size-label">
        <span>Размер шрифта</span>
        <div aria-labelledby="font-size-label" class="flex space-x-4">
          <button
              class="w-8 h-8 flex items-center justify-center border border-tertiary cursor-pointer"
              aria-label="Обычный размер шрифта"
              @click="setFontSize('normal')">
            <span class="text-base" aria-hidden="true">A</span>
          </button>
          <button
              class="w-8 h-8 flex items-center justify-center border border-tertiary cursor-pointer"
              aria-label="Увеличенный размер шрифта"
              @click="setFontSize('large')">
            <span class="text-2xl" aria-hidden="true">A</span>
          </button>
          <button
              class="w-8 h-8 flex items-center justify-center border border-tertiary cursor-pointer"
              aria-label="Большой размер шрифта"
              @click="setFontSize('xlarge')">
            <span class="text-4xl" aria-hidden="true">A</span>
          </button>
        </div>
      </label>

      <label class="flex gap-4 items-center flex-col" id="letter-spacing-label">
        <span>Межбуквенный интервал</span>
        <div aria-labelledby="letter-spacing-label" class="flex space-x-4">
          <button class="px-2 border border-tertiary tracking-[0rem]"
                  @click="setLetterSpacing('normal')"
                  aria-label="Обычный межбуквенный интервал">Обычный</button>
          <button class="px-2 border border-tertiary tracking-[.1rem]"
                  @click="setLetterSpacing('large')"
                  aria-label="Средний межбуквенный интервал">Средний</button>
          <button class="px-2 border border-tertiary tracking-[.2rem]"
                  @click="setLetterSpacing('xlarge')"
                  aria-label="Большой межбуквенный интервал">Большой</button>
        </div>
      </label>

      <label class="flex gap-4 items-center flex-col" id="line-height-label">
        <span>Межстрочный интервал</span>
        <div aria-labelledby="line-height-label" class="flex space-x-4">
          <button class="px-2 border border-tertiary leading-[1.5rem]"
                  @click="setLineHeight('normal')"
                  aria-label="Обычный межстрочный интервал">Обычный</button>
          <button class="px-2 border border-tertiary leading-[1.75rem]"
                  @click="setLineHeight('large')"
                  aria-label="Средний межстрочный интервал">Средний</button>
          <button class="px-2 border border-tertiary leading-[.2rem]"
                  @click="setLineHeight('xlarge')"
                  aria-label="Большой межстрочный интервал">Большой</button>
        </div>
      </label>

      <div class="flex gap-5 items-center flex-col">
        <label for="serif-font">Шрифт с засечками</label>
          <div>
            <input
                class="text-black"
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
              class="w-8 h-8 bg-white border cursor-pointer border-tertiary"
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
              class="w-8 h-8 bg-black border cursor-pointer border-tertiary"
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
              class="w-8 h-8 border cursor-pointer border-tertiary"
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
    </div>
</template>