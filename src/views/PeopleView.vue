<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import Dialog from "@/components/UI/Dialog.vue";
import PersonForm from "@/components/Forms/PersonForm.vue";
import PeopleTable from "@/components/UI/PeopleTable.vue";

const people = ref([])
const person = ref({})
const addPersonDialogVisible = ref(false)

const fileInput = ref(null);

onMounted(async () => {
  await loadPeople()
})

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
</script>

<template>
    <div>
        <h1>Пользователи</h1>
        <div class="flex justify-between my-3">
            <input class="my-input" type="text" placeholder="Поиск...">
            <div class="flex gap-5">
              <button class="my-button bg-primary" @click="showAddPersonDialog">Добавить</button>
              <input type="file" @change="importPeople" accept=".xlsx" ref="fileInput" style="display: none" />
              <button class="my-button" @click="triggerFileSelectionAndUpload">Импорт</button>
              <button class="my-button" @click="exportPeople">Экспорт</button>
            </div>
        </div>
        <PeopleTable :people="people"/>
    </div>

    <div>
      <Dialog v-model:show="addPersonDialogVisible">
        <h1>Новый пользователь</h1>
        <PersonForm
            @savePersonData="createPerson"
            :person="person"/>
      </Dialog>
    </div>
</template>
