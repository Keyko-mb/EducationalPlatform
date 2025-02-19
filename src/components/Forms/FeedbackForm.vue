<script setup>
import emailjs from "@emailjs/browser";
import {h, ref} from "vue";
import ToastMessage from "@/components/UI/ToastMessage.vue";
import {useToast} from "vue-toastification";
import Loader from "@/components/UI/Loader.vue";
import {useForm} from "vee-validate";
import * as yup from "yup";

const toast = useToast();
const isLoading = ref(false)
const emit = defineEmits(['success']);

const schema = yup.object({
  name: yup.string()
      .required("Обязательное поле"),
  email: yup.string()
      .email("Некорректная почта")
      .nullable(),
  message: yup.string()
      .max(2000, "Сообщение не должно превышать 2000 символов")
      .nullable(),
});

const {handleSubmit, errors, defineField} = useForm({
  validationSchema: schema
});

const [nameField, nameAttrs] = defineField('name');
const [emailField, emailAttrs] = defineField('email');
const [messageField, messageAttrs] = defineField('message');

const sendEmail = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    await emailjs
        .send(
            "service_252daj9",
            "template_fjxzb8f",
            values,
            "HanA1mgaWnOOYsxse")
    const toastContent = h(ToastMessage, {
      message: "Сообщение отправлено",
      details: {info: "Спасибо за ваше обращение"}
    });
    toast.success(toastContent);
    emit("success", true)
  } catch (error) {
    console.error("Ошибка при отправке:", error);
    const toastContent = h(ToastMessage, {message: "Ошибка при отправке", details: error});
    toast.error(toastContent);
  } finally {
    isLoading.value = false
  }
});
</script>

<template>
  <div>
    <Loader :is-active="isLoading" class="min-h-60"/>
    <div v-if="!isLoading">
      <form @submit.prevent="sendEmail" aria-labelledby="form-title">
        <div>
          <div class="my-5">
            <label for="name">Имя</label>
            <input
                id="name"
                type="text"
                v-model="nameField"
                v-bind="nameAttrs"
                aria-label="Поле для ввода вашего имени"
                placeholder="Введите имя"
                class="my-input w-full"/>
            <p v-if="errors.name" class="error">{{ errors.name }}</p>
          </div>

          <div class="mb-3">
            <label for="email">Почта</label>
            <input
                id="email"
                type="email"
                v-model="emailField"
                v-bind="emailAttrs"
                aria-label="Поле для ввода почты"
                placeholder="Введите почту для обратной связи"
                class="my-input w-full"/>
            <p v-if="errors.email" class="error">{{ errors.email }}</p>
          </div>

          <div class="mb-3">
            <label for="message">Сообщение</label>
            <textarea
                id="message"
                v-model="messageField"
                v-bind="messageAttrs"
                class="my-input w-full min-h-52"
                aria-label="Поле для ввода сообщения"
                placeholder="Подробно опишите свою проблему"></textarea>
            <p v-if="errors.message" class="error">{{ errors.message }}</p>
          </div>
          <button
              type="submit"
              class="my-button mt-5">
            Отправить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

