<script setup lang="ts">
import {ref} from 'vue';
import SettingsPanel from './SettingsPanel.vue';
import {useAuthStore} from "@/stores/auth.js";
import {useStudentStore} from "@/stores/studentInfo.js";

const authStore = useAuthStore()

const studentStore = useStudentStore()
// const person = ref({})

const isAccessible = ref(false);

const makeAccessible = () => {
    if (isAccessible.value) {
      isAccessible.value = false;
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-blue');
      document.documentElement.style.setProperty('--font-size', '1em');
      document.documentElement.style.setProperty('--font-family', 'Nunito, sans-serif');
      document.documentElement.style.setProperty('--line-height-factor', '1.5');
      document.documentElement.style.setProperty('--letter-spacing-factor', '0');
      document.body.classList.toggle('disable-images', false);
    } else {
        isAccessible.value = true;
    }
}

// const fetchPerson = () => {
//   if (authStore.userInfo.id) {
//     try {
//       axios
//           .get(`people/${authStore.userInfo.id}`)
//           .then((response) => {
//             person.value = response.data
//           })
//     } catch (error) {
//       console.error("Ошибка загрузки данных о пользователе:", error);
//     }
//   }
// };
//
// watch(() => authStore.userInfo.id, (newId) => {
//   if (newId) {
//     fetchPerson();
//   }
// });
//
// onMounted(() => {
//   if (authStore.userInfo.id) {
//     fetchPerson();
//   }
// });

</script>

<template>
  <header class="navbar" role="banner">
    <div class="border-b border-gray-300 shadow py-5" >
      <div class="container mx-auto">
        <nav class="flex justify-between items-center" role="navigation" aria-label="Основная навигация">
          <div class="flex space-x-10">
            <RouterLink to="/" aria-label="МультиЗнайка - Перейти на главную страницу">
              <h1 class="font-extrabold text-logoColor hover:brightness-125 transition-all">МультиЗнайка</h1>
            </RouterLink>
            <div class="flex space-x-10 items-center" role="menubar" aria-labelledby="menu-label">
              <h2 class="sr-only" id="menu-label">Пункты меню</h2>
              <RouterLink active-class="active" to="/" role="menuitem"><h3 class="navbar-text">Главная</h3></RouterLink>
              <RouterLink active-class="active" to="/curricula" v-if="authStore.isAuthenticated" role="menuitem" ><h3 class="navbar-text">Обучение</h3></RouterLink>
              <RouterLink active-class="active" to="/people" v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'" role="menuitem" ><h3 class="navbar-text">Пользователи</h3></RouterLink>
              <RouterLink active-class="active" to="/classrooms" v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'" role="menuitem" ><h3 class="navbar-text">Учебные группы</h3></RouterLink>
            </div>
          </div>

          <div class="flex items-center gap-20">
            <button
                @click="makeAccessible"
                class="w-10 h-10 hover:opacity-100"
                :class="[isAccessible ? 'opacity-100' : 'opacity-40']"
                aria-label="Переключить версию для пользователей с ОВЗ"
            >
              <img src="/eye.svg" alt="Настройки интерфейса"/>
            </button>

            <div v-if="authStore.isAuthenticated">
              <RouterLink active-class="active" to="/account" aria-label="Личный кабинет" role="menuitem"
                          class="flex items-center gap-2 cursor-pointer">
                  <h3 class="hover:opacity-50">{{`${studentStore.lastName} ${studentStore.firstName}`}}</h3>
                  <img src='/user.svg' class="w-10 h-10 opacity-80 hover:opacity-100" alt="Иконка пользователя">
              </RouterLink>
            </div>
            <div v-else>
              <RouterLink active-class="active" to="/signIn" aria-label="Авторизация"><h3 class="hover:opacity-50">Вход</h3></RouterLink>
            </div>
          </div>
        </nav>

        <Transition
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
            enter-active-class="transition duration-500"
            leave-active-class="transition duration-500">
          <SettingsPanel v-if="isAccessible" class="pt-8"/>
        </Transition>

      </div>
    </div>
  </header>
</template>