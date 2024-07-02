<script setup>
import { ref } from 'vue';
import { useThemeStore } from '../../stores/theme.js';

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

const setFontSize = (size) => {
    themeStore.setFontSize(size);
}

const setTheme = (theme) => {
    themeStore.setTheme(theme);
}

</script>

<template>
    <div class="flex gap-16 items-center ">
        <label class="flex gap-3 items-center flex-col">
            Размер шрифта
            <div class="flex space-x-4 ">
                <button
                    class="w-8 h-8 flex items-center justify-center border cursor-pointer"
                    title="Обычный"
                    @click="setFontSize('normal')"
                    >
                        <p class="text-base">A</p>
                </button>
                <button
                    class="w-8 h-8 flex items-center justify-center border cursor-pointer"
                    title="Увеличенный"
                    @click="setFontSize('large')"
                    >
                        <p class="text-2xl">A</p>
                </button>
                <button
                    class="w-8 h-8 flex items-center justify-center border cursor-pointer"
                    title="Большой"
                    @click="setFontSize('xlarge')"
                    >
                        <p class="text-4xl">A</p>
                </button>
            </div>
        </label>
        <div >
            <label class="flex gap-5 items-center flex-col">
                Шрифт с засечками
                <div>
                    <input class="text-black" type="checkbox" text="С засечками" v-model="isSerif" @change="setSerif">
                    Вкл.
                </div>
            </label>
        </div>
        
        <label class="flex gap-3 items-center flex-col">
            Цвет сайта
            <div class="flex space-x-4">
                <label
                  class="w-8 h-8 bg-white border cursor-pointer"
                  title="Светлая тема"
                  @click="setTheme('light')"
                >
                    <input type="radio" name="theme" class="hidden" />
                </label>
                <label
                  class="w-8 h-8 bg-black border cursor-pointer"
                  title="Темная тема"
                  @click="setTheme('dark')"
                >
                    <input type="radio" name="theme" class="hidden" />
                </label>
                <label
                  class="w-8 h-8 border cursor-pointer"
                  style="background-color: #9DD1FF;"
                  title="Голубая тема"
                  @click="setTheme('blue')"
                >
                    <input type="radio" name="theme" class="hidden" />
                </label>
              </div>
        </label>
    </div>
</template>