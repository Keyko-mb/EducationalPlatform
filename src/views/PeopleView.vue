<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import Dialog from "@/components/UI/Dialog.vue";
import PersonForm from "@/components/Forms/PersonForm.vue";
import PeopleTable from "@/components/UI/PeopleTable.vue";
import Loader from "@/components/UI/Loader.vue";

const people = ref([])
const person = ref({})
const addPersonDialogVisible = ref(false)
const fileInput = ref(null);
const isLoading = ref(false);

const currentPage = ref(0);
const pageSize = ref(20);
const totalPages = ref(0);

onMounted(() => {
  loadPeople();
  document.body.classList.add('table-page');
})

onUnmounted(() => {
  document.body.classList.remove('table-page');
});

const loadPeople = async () => {
  // isLoading.value = true;
  try {
    const response = await axios.get("people/paginated", {
      params: {
        page: currentPage.value,
        size: pageSize.value,
      }
    });
    people.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
  } finally {
    isLoading.value = false;
  }
}

const updatePeople = (updatedPeople) => {
  people.value = updatedPeople;
}

const handlePageChange = async (pageNumber) => {
  if (pageNumber >= 0 && pageNumber < totalPages.value) {
    currentPage.value = pageNumber;
    await loadPeople();
  }
};

const showAddPersonDialog = () => {
  addPersonDialogVisible.value = true;
}

const createPerson = async (person) => {
  try {
    isLoading.value = true;
    const response = await axios.post("auth/register", person);
    people.value.push(response.data.person);
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
  } finally {
    isLoading.value = false;
    addPersonDialogVisible.value = false;
  }
}

const triggerFileSelectionAndUpload = () => {
  fileInput.value?.click();
};

const importPeople = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isLoading.value = true;
  const formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post("admin/users/import", formData, {
      headers: {"Content-Type": "multipart/form-data"}
    });
    await loadPeople();
  } catch (error) {
    console.error("Ошибка при импорте:", error);
  } finally {
    isLoading.value = false;
  }
};

const exportPeople = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get("admin/users/export-passwords", {
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
  } finally {
    isLoading.value = false;
  }
}

const searchQuery = ref('');

const filteredPeople = computed(() => {
  return people.value.filter(person =>
      person.lastName.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
});

const visiblePages = computed(() => {
  const maxVisible = 10;
  const pages = [];
  const total = totalPages.value;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    const half = Math.floor(maxVisible / 2);
    let start = currentPage.value + 1 - half;
    start = start < 1 ? 1 : start;
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = end - maxVisible + 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);
  }
  return pages;
});
</script>

<template>
  <div>
    <Loader class="min-h-60" :is-active="isLoading"/>
    <div v-if="!isLoading">
      <h1>Пользователи</h1>
      <div class="flex flex-col sm:flex-row md:flex-row lg:flex-row justify-between my-3 gap-2">
        <label for="search-input" class="sr-only">Поле для поиска пользователя по фамилии</label>
        <input
            id="search-input"
            type="text"
            v-model="searchQuery"
            class="my-input"
            placeholder="Поиск по фамилии..."
        />

        <div class="flex flex-col sm:flex-row md:flex-row lg:flex-row gap-2 lg:gap-5">
          <button class="my-button bg-primary" @click="showAddPersonDialog">Добавить</button>
          <input type="file" @change="importPeople" accept=".xlsx" ref="fileInput" hidden/>
          <button class="my-button" @click="triggerFileSelectionAndUpload">Импорт</button>
          <button class="my-button" @click="exportPeople">Экспорт</button>
        </div>
      </div>

      <PeopleTable v-if="filteredPeople.length > 0" :people="filteredPeople" @updatePeople="updatePeople"/>
      <p v-else>Пользователи не найдены</p>
    </div>

    <div class="flex items-center justify-center my-4">
      <button
          class="px-3 py-1 border border-tertiary rounded-lg shadow-md bg-formColor transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
          :disabled="currentPage <= 0"
          @click="handlePageChange(currentPage - 1)">
        <
      </button>
      <div class="mx-3 flex space-x-1">
        <span
            v-for="n in visiblePages"
            :key="n"
            @click="handlePageChange(n - 1)"
            class="cursor-pointer px-3 py-1 rounded-lg"
            :class="{
            'bg-logoColor text-formColor': currentPage + 1 === n,
            'bg-formColor border border-tertiary': currentPage + 1 !== n
          }">
          {{ n }}
        </span>
      </div>
      <button
          class="px-3 py-1 border border-tertiary rounded-lg shadow-md bg-formColor transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
          :disabled="currentPage >= totalPages - 1"
          @click="handlePageChange(currentPage + 1)">
        >
      </button>
    </div>

    <Dialog v-model:show="addPersonDialogVisible">
      <h2 id="dialog-title" class="sr-only">Окно для создания нового пользователя</h2>
      <Loader class="min-h-60" :is-active="isLoading"/>
      <PersonForm v-if="!isLoading"
          @savePersonData="createPerson"
          :person="person"/>
    </Dialog>
  </div>
</template>
