<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import SettingsPanel from './SettingsPanel.vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/studentInfo.js'

const authStore = useAuthStore()
const studentStore = useStudentStore()

const isMenuOpen = ref(false)
const menuRef = ref(null)
const isAccessible = ref(false)

const makeAccessible = () => {
  isAccessible.value = !isAccessible.value
}
</script>

<template>
  <header class="navbar relative" role="banner">
    <div class="border-b border-gray-300 shadow py-5">
      <div class="container mx-auto px-4">
        <nav class="flex justify-between items-center gap-5" role="navigation" aria-label="Основная навигация">
          <div class="flex items-center gap-2 lg:gap-10">
            <!-- Бургер-меню для мобильных -->
            <button
                @click="isMenuOpen = !isMenuOpen"
                class="lg:hidden rounded-lg hover:bg-gray-100"
                aria-label="Открыть меню"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor">
                <path
                    v-if="!isMenuOpen"
                    stroke-linecap="round"
                    d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                    v-if="isMenuOpen"
                    stroke-linecap="round"
                    d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <RouterLink to="/" aria-label="МультиЗнайка - Перейти на главную страницу">
              <h1 class="font-extrabold text-logoColor hover:brightness-125 transition-all">МультиЗнайка</h1>
            </RouterLink>

            <!-- Десктопное меню -->
            <div class="hidden lg:flex space-x-10 items-center" role="menubar" aria-labelledby="menu-label">
              <h2 class="sr-only" id="menu-label">Пункты меню</h2>
              <RouterLink active-class="active" to="/" role="menuitem"><h3 class="navbar-text">Главная</h3></RouterLink>
              <RouterLink active-class="active" to="/curricula" v-if="authStore.isAuthenticated" role="menuitem">
                <h3 class="navbar-text">Обучение</h3>
              </RouterLink>
              <RouterLink
                  active-class="active"
                  to="/people"
                  v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'"
                  role="menuitem"
              >
                <h3 class="navbar-text">Пользователи</h3>
              </RouterLink>
              <RouterLink
                  active-class="active"
                  to="/classrooms"
                  v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'"
                  role="menuitem"
              >
                <h3 class="navbar-text">Учебные группы</h3>
              </RouterLink>
            </div>
          </div>

          <!-- Мобильное меню -->
          <Transition
              enter-from-class="opacity-0"
              leave-to-class="opacity-0"
              enter-active-class="transition duration-500"
              leave-active-class="transition duration-500"
          >
            <div
                ref="menuRef"
                v-show="isMenuOpen"
                class="lg:hidden absolute top-full left-0 right-0 bg-formColor z-50 p-4 shadow-lg space-y-4"
            >
              <RouterLink
                  active-class="active"
                  to="/"
                  role="menuitem"
                  class="block p-2 hover:brightness-95 rounded"
                  @click="isMenuOpen = false"
              >
                <h3 class="navbar-text">Главная</h3>
              </RouterLink>
              <hr class="border-t border-logoColor opacity-30"/>
              <RouterLink
                  active-class="active"
                  to="/curricula"
                  v-if="authStore.isAuthenticated"
                  role="menuitem"
                  class="block p-2 hover:brightness-95 rounded"
                  @click="isMenuOpen = false"
              >
                <h3 class="navbar-text">Обучение</h3>
              </RouterLink>
              <hr v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'" class="border-t border-logoColor opacity-30"/>
              <RouterLink
                  active-class="active"
                  to="/people"
                  v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'"
                  role="menuitem"
                  class="block p-2 hover:brightness-95 rounded"
                  @click="isMenuOpen = false"
              >
                <h3 class="navbar-text">Пользователи</h3>
              </RouterLink>
              <hr v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'" class="border-t border-logoColor opacity-30"/>
              <RouterLink
                  active-class="active"
                  to="/classrooms"
                  v-if="authStore.isAuthenticated && authStore.userInfo.role === 'ADMIN'"
                  role="menuitem"
                  class="block p-2 hover:brightness-95 rounded"
                  @click="isMenuOpen = false"
              >
                <h3 class="navbar-text">Учебные группы</h3>
              </RouterLink>
            </div>
          </Transition>

          <!-- Правая часть хедера -->
          <div class="flex items-center gap-4 lg:gap-20">
            <button
                @click="makeAccessible"
                class="w-8 h-8 lg:w-10 lg:h-10 hover:opacity-100"
                :class="[isAccessible ? 'opacity-100' : 'opacity-40']"
                aria-label="Переключить версию для пользователей с ОВЗ"
            >
              <img src="/eye.svg" alt="Настройки" class="w-full h-full"/>
            </button>

            <div v-if="authStore.isAuthenticated">
              <RouterLink
                  active-class="active"
                  to="/account"
                  aria-label="Личный кабинет"
                  role="menuitem"
                  class="flex items-center gap-2 cursor-pointer"
              >
                <Transition name="fade" appear>
                  <h3 class="hover:opacity-50">
                    {{ `${studentStore.lastName} ${studentStore.firstName}` }}
                  </h3>
                </Transition>
<!--                <img src='/user.svg' class="w-8 h-8 lg:w-10 lg:h-10 opacity-80 hover:opacity-100" alt="Иконка пользователя">-->
              </RouterLink>
            </div>
            <div v-else>
              <RouterLink active-class="active" to="/signIn" aria-label="Авторизация">
                <h3 class="hover:opacity-50">Вход</h3>
              </RouterLink>
            </div>
          </div>
        </nav>

        <Transition
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
            enter-active-class="transition duration-500"
            leave-active-class="transition duration-500"
        >
          <SettingsPanel v-show="isAccessible" class="pt-8"/>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style>
.fade-enter-active, .fade-appear-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-appear-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-appear-to,
.fade-leave-from {
  opacity: 1;
}
</style>