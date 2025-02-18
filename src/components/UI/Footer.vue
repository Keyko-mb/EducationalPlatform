<script setup>
import {ref} from "vue";
import Dialog from "@/components/UI/Dialog.vue";
import FeedbackForm from "@/components/Forms/FeedbackForm.vue";

const feedbackFormVisible = ref(false)

const showFeedbackForm = () => {
  feedbackFormVisible.value = true;
}
const sendFeedback = () => {
  feedbackFormVisible.value = false;
}
</script>

<template>
<!--  <footer class="container mx-auto px-4 py-10">-->
<!--    <div class="flex justify-between items-start gap-5 opacity-50">-->
<!--      <div class="flex flex-col gap-2">-->
<!--        <h3 class="font-extrabold">МультиЗнайка</h3>-->
<!--        <p>© 2008-2023 МультиЗнайка</p>-->
<!--      </div>-->
<!--      <button-->
<!--          @click="showFeedbackForm"-->
<!--          class="hover:underline">-->
<!--        Обратная связь-->
<!--      </button>-->
<!--    </div>-->
<!--  </footer>-->
  <hr class="border-t border-gray-300"/>
  <footer class="container mx-auto px-4 py-10">
      <div class="flex justify-between items-start gap-5 opacity-50">
        <div class="flex flex-col gap-2">
          <h3 class="font-extrabold">МультиЗнайка</h3>
          <p>© 2008-2023 МультиЗнайка</p>
        </div>
        <button
            @click="showFeedbackForm"
            class="hover:underline">
          Обратная связь
        </button>
      </div>


<!--        <a href="mailto:mail@mail.ru" class="hover:underline">-->
<!--          mail@mail.ru-->
<!--        </a>-->
<!--        <span>|</span>-->
  </footer>

  <Dialog v-model:show="feedbackFormVisible" aria-labelledby="dialog-title">
    <h2 id="dialog-title" class="sr-only">Форма обратной связи</h2>
    <FeedbackForm @sendFeedback="sendFeedback"/>
  </Dialog>
</template>
