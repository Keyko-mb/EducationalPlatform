<script setup lang="ts">
import { ref } from 'vue';
import SettingsPanel from './SettingsPanel.vue';

const isAccessible = ref(false);

const makeAccessible = () => {
    if (isAccessible.value) {
        isAccessible.value = false;
        document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-blue');
        document.documentElement.style.setProperty('--font-size', '1em');
        document.documentElement.style.setProperty('--font-family', 'Nunito, sans-serif');
    } else {
        isAccessible.value = true;
    }
}
</script>

<template>
    <div class="border-b border-gray-300 shadow py-5" >
        <div class="container mx-auto">
            <header class="flex justify-between items-center">
                <div class="flex space-x-10">
                    <RouterLink to="/"><h1>МультиЗнайка</h1></RouterLink>
                    <div class="flex space-x-10 items-center">
                      <RouterLink active-class="active" to="/"><h3 class="hover:opacity-50">Главная</h3></RouterLink>
                      <RouterLink active-class="active" to="/curricula"><h3 class="hover:opacity-50">Обучение</h3></RouterLink>
                      <RouterLink active-class="active" to="/people"><h3 class="hover:opacity-50">Пользователи</h3></RouterLink>
                    </div>
                </div>
                <div class="flex items-center gap-20">
                    <input @click="makeAccessible"
                    type="image"
                    alt="visually impaired version"
                    src='/eye.svg'
                    class="w-10 h-10 hover:opacity-100" 
                    :class="[isAccessible ? 'opacity-100' : 'opacity-40']"/>
                    <RouterLink active-class="active" to="/account"> 
                    <label class="flex items-center gap-2 cursor-pointer">
                        <h3 class="hover:opacity-50">Фамилия И.О.</h3> 
                        <img src='/user.svg' class="w-10 h-10 opacity-80 hover:opacity-100" alt="">
                    </label>
                    </RouterLink>

                    
                </div>
            </header>

            <Transition
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                enter-active-class="transition duration-500"
                leave-active-class="transition duration-500">
                <SettingsPanel v-if="isAccessible" class="pt-5"/>
            </Transition>
            
        </div>
    </div>
</template>

<style>
.active {
    @apply underline text-secondary;
}
</style>