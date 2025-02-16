<script setup>
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.js";

import { useForm } from "vee-validate";
import * as yup from "yup";

const authStore = useAuthStore()
const router = useRouter()

const schema = yup.object({
  username: yup.string().required("Обязательное поле"),
  password: yup.string().required("Обязательное поле"),
});

const { handleSubmit, errors, setErrors, defineField  } = useForm({
  validationSchema: schema,
});

const [usernameField, usernameAttrs] = defineField('username');
const [passwordField, passwordAttrs] = defineField('password');

const signIn = handleSubmit(async (values) => {
  try {
    const response = await authStore.signIn({username: values.username, password: values.password});
    if (response.success) {
      await router.push("/");
    } else {
      setErrors({password : ["Неверный логин или пароль"]});
    }
  } catch (error) {
  }
});

</script>

<template>
  <div class="flex flex-col items-center h-screen justify-center -m-20">
    <form @submit.prevent="signIn">
      <h1>Вход в систему</h1>
      <div class="my-5 space-y-5">
        <div class="flex flex-col">
          <label for="username">Логин</label>
          <input class="my-input" type="text" id="username" v-model="usernameField" v-bind="usernameAttrs" aria-label="Поле для ввода логина">
          <p v-if="errors.username" class="error">{{ errors.username }}</p>
        </div>
        <div class="flex flex-col">
          <label for="password">Пароль</label>
          <input class="my-input" type="password" id="password" v-model="passwordField" v-bind="passwordAttrs" aria-label="Поле для ввода пароля">
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>
      </div>

      <button class="my-button" type="submit">Войти</button>

    </form>
  </div>
</template>

<style scoped>

</style>