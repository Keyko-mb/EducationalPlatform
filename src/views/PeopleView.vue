<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import Dialog from "@/components/UI/Dialog.vue";
import PersonForm from "@/components/Forms/PersonForm.vue";
import PeopleTable from "@/components/UI/PeopleTable.vue";

const people = ref([])
const person = ref({})
const addPersonDialogVisible = ref(false)

const fileInput = ref(null);

onMounted(async () => {
  await loadPeople();
  document.body.classList.add('table-page');
})

onUnmounted(() => {
  document.body.classList.remove('table-page');
});

const loadPeople = async () => {
  axios.get('people').then((response) => {
    people.value = response.data
  })
}

const showAddPersonDialog = () => {
  addPersonDialogVisible.value = true;
}

const createPerson = (person) => {
  axios
      .post("auth/register", person)
      .then(() => {
        people.value.push(person)
      })
  addPersonDialogVisible.value = false
}

const triggerFileSelectionAndUpload = () => {
  if (fileInput.value) {
    fileInput.value.click(); // Открываем файловую систему
  }
};

const importPeople = async (event) =>
    {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post("admin/users/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await loadPeople();
      } catch (error) {
        console.error("Ошибка при импорте:", error);
        importResult.value =
            error.response?.data || "Произошла ошибка при загрузке файла.";
      }
    }
;

const exportPeople = async () => {
  try {
    const response = await axios.get("admin/users/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", "users.xlsx");
    document.body.appendChild(link);
    link.click();

    link.remove();
  } catch (error) {
    console.error("Ошибка при экспорте файла:", error);
  }
}

const searchQuery = ref('');

const filteredPeople = computed(() => {
  return people.value.filter(person =>
      person.lastName.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
    <div>
        <h1>Пользователи</h1>
        <div class="flex justify-between my-3">
          <label for="search-input" class="sr-only">Поле для поиска пользователя по фамилии</label>
                    <input
              id="search-input"
              type="text"
              v-model="searchQuery"
              class="my-input"
              placeholder="Поиск по фамилии..."
          />

          <div class="flex gap-5">
            <button class="my-button bg-primary" @click="showAddPersonDialog">Добавить</button>
            <input type="file" @change="importPeople" accept=".xlsx" ref="fileInput" style="display: none" id="file-input"/>
            <button class="my-button" @click="triggerFileSelectionAndUpload">Импорт</button>
            <button class="my-button" @click="exportPeople">Экспорт</button>
          </div>
        </div>

        <PeopleTable v-if="filteredPeople.length > 0" :people="filteredPeople"/>
        <p v-else>Пользователи не найдены</p>
    </div>

    <div>
      <Dialog v-model:show="addPersonDialogVisible">
        <h2 id="dialog-title" class="sr-only">Окно для создания нового пользователя</h2>
        <PersonForm
            @savePersonData="createPerson"
            :person="person"/>
      </Dialog>
    </div>
</template>