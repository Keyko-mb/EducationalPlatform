<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.js";

const authStore = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')

const signIn = () => {
  authStore.signIn({username: username.value, password: password.value})
  router.push('/')
}

</script>

<template>
  <div class="flex flex-col items-center h-screen justify-center -m-20">
    <form @submit.prevent="signIn">
      <h1>Вход в систему</h1>
      <div class="my-5 space-y-5">
        <div class="flex flex-col">
          <label for="username">Логин</label>
          <input class="my-input" type="text" id="username" v-model="username" aria-label="Поле для ввода логина">
        </div>
        <div class="flex flex-col">
          <label for="password">Пароль</label>
          <input class="my-input" type="password" id="password" v-model="password" aria-label="Поле для ввода пароля">
        </div>
      </div>

      <button class="my-button" type="submit">Войти</button>

    </form>
  </div>
</template>

<style scoped>

</style>