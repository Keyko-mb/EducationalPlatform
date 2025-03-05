<script setup>
import {ref} from "vue";
import Dialog from "@/components/UI/Dialog.vue";
import FeedbackForm from "@/components/Forms/FeedbackForm.vue";

const feedbackFormVisible = ref(false)

const showFeedbackForm = () => {
  feedbackFormVisible.value = true;
}
</script>

<template>
<!--    <footer class="container mx-auto px-4 mt-20 opacity-50 ">-->
<!--      <hr class="border-t border-gray-300"/>-->
<!--        <div class="flex justify-between gap-5 py-10">-->
<!--          <div class="flex flex-col gap-2">-->
<!--            <h3 class="font-extrabold">МультиЗнайка</h3>-->
<!--          </div>-->
<!--          <button-->
<!--              @click="showFeedbackForm"-->
<!--              class="hover:underline">-->
<!--            Обратная связь-->
<!--          </button>-->
<!--        </div>-->
<!--    </footer>-->

  <hr class="border-t border-gray-300 opacity-50"/>
  <footer class="container mx-auto px-4 py-10">
      <div class="flex justify-between items-start gap-5 opacity-50">
        <div class="flex flex-col items-center gap-2">
          <h3 class="font-extrabold">МультиЗнайка</h3>
          <div class="flex space-x-2 opacity-70">
            <a href="https://vk.com/znaika_centr" target="_blank" aria-label="VK" class="hover:opacity-75">
              <img src="/vk.svg" alt="VK" class="w-7 h-7" />
            </a>
            <a href="https://t.me/razvitie_detei_znaika" target="_blank" aria-label="Telegram" class="hover:opacity-75">
              <img src="/telegram.svg" alt="Telegram" class="w-7 h-7" />
            </a>
            <a href="https://api.whatsapp.com/send/?phone=79171761325&type=phone_number&app_absent=0" target="_blank" aria-label="Whatsapp" class="hover:opacity-75">
              <img src="/whatsapp.svg" alt="Whatsapp" class="w-7 h-7" />
            </a>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2">
          <button
              @click="showFeedbackForm"
              class="hover:underline">
            Обратная связь
          </button>
<!--          <p>+7 (917) 176-13-26</p>-->
        </div>
      </div>
  </footer>

  <Dialog v-model:show="feedbackFormVisible" aria-labelledby="dialog-title">
    <h2 id="dialog-title" class="sr-only">Форма обратной связи</h2>
    <FeedbackForm @success="feedbackFormVisible = false"/>
  </Dialog>
</template>
