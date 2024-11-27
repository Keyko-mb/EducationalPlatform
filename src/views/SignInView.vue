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
    <form>
      <h1>Вход в систему</h1>
      <div class="my-5 space-y-5">
        <div>
          <p>Логин</p>
          <input class="my-input" type="email" id="email" v-model="username">
        </div>
        <div>
          <p>Пароль</p>
          <input class="my-input" type="password" id="password" v-model="password">
        </div>
      </div>
      <div class="flex gap-5">
        <button class="my-button" @click="signIn">Войти</button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>