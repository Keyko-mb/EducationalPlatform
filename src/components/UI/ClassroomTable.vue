<script setup lang="ts">
import {computed, defineProps, ref} from "vue";
import Dialog from "@/components/UI/Dialog.vue";

const props = defineProps(["classroom"]);
const deleteConfirmDialogVisible = ref(false);

const emits = defineEmits(['deleteClassroom'])

const showDeleteConfirm = () => {
  deleteConfirmDialogVisible.value = true;
}

const emitDeleteClassroom = () => {
  const classroomId = props.classroom.id
  emits('deleteClassroom', classroomId)
  deleteConfirmDialogVisible.value = false;
}

const searchQuery = ref('');

const filteredPeople = computed(() => {
  return props.classroom.persons.filter(person =>
      person.lastName.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="overflow-auto">
    <div class="flex items-start lg:gap-2 px-1 pt-1">
      <details class="w-full" open>
        <summary style="font-size: 1.25em;"
                 role="button"
                 aria-expanded="true">
          {{props.classroom.name}}
        </summary>
        <label for="search-input" class="sr-only">Поле для поиска пользователя в группе по фамилии</label>
        <input
            id="search-input"
            type="text"
            v-model="searchQuery"
            class="my-input mt-2"
            placeholder="Поиск по фамилии..."
        />
        <table v-if="filteredPeople.length > 0" class="w-full rounded-lg overflow-hidden border-collapse shadow-md mt-2">
          <caption class="sr-only">
            Список студентов учебной группы {{ props.classroom.name }}
          </caption>
          <thead>
          <tr class="bg-tableColor bg-opacity-75 border border-tertiary">
            <th class="my-th" scope="col">Фамилия</th>
            <th class="my-th" scope="col">Имя</th>
            <th class="my-th" scope="col">Отчество</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="person in filteredPeople" :key="person.id" class="bg-formColor" role="row">
            <td class="my-td border-l border-tertiary">{{ person.lastName }}</td>
            <td class="my-td">{{ person.firstName }}</td>
            <td class="my-td border-r border-tertiary">{{ person.patronymic }}</td>
          </tr>
          </tbody>
        </table>
        <p class="mt-2" v-else>Участники группы не найдены</p>
      </details>
      <button
          @click="showDeleteConfirm"
          class="cursor-pointer w-5 h-5 opacity-50 hover:opacity-100"
          :aria-label='"Удалить учебную группу " + props.classroom.name'
      >
        <img src="/delete.svg" alt="" role="presentation"/>
      </button>
    </div>

    <Dialog v-model:show="deleteConfirmDialogVisible" aria-labelledby="confirm-dialog-title">
      <h2 id="confirm-dialog-title" class="text-lg mb-4">Подтверждение удаления</h2>
      <p class="mb-4">Вы уверены, что хотите удалить учебную группу "{{ props.classroom.name }}"?</p>
      <div class="flex gap-4 justify-end">
        <button
            @click="deleteConfirmDialogVisible = false"
            class="my-button"
        >
          Отмена
        </button>
        <button
            @click="emitDeleteClassroom"
            class="my-button-danger"
        >
          Удалить
        </button>
      </div>
    </Dialog>
  </div>
</template>

<style>
th, td {
  padding: 10px;
  text-align: center;
  @apply border-b border-secondary;
}
</style>
