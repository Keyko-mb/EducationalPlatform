<script setup>
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";
import {useForm} from "vee-validate";
import * as yup from "yup";

const emit = defineEmits(["saveClassroomData"]);
const props = defineProps({
  classroom: {type: Object, default: () => ({name: "", persons: []})}
});

const schema = yup.object({
  name: yup.string()
      .min(2, "Название должно содержать от 2 символов")
      .max(100, "Название должно содержать до 100 символов")
      .required("Название не может быть пустым"),
  persons: yup.array()
      .max(50, "В группе может быть не более 5 человек")
      .nullable(),
});

const {handleSubmit, errors, defineField, resetForm} = useForm({
  validationSchema: schema,
  initialValues: props.classroom
});

const [nameField, nameAttrs] = defineField("name");
const [personsField] = defineField("persons");

const people = ref([]);
const studentsInOtherClassrooms = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const [peopleResponse, classroomsResponse] = await Promise.all([
      axios.get("people"),
      axios.get("classrooms")
    ]);

    people.value = peopleResponse.data.filter(person => person.role === "STUDENT");

    studentsInOtherClassrooms.value = [];

    const classrooms = classroomsResponse.data;
    classrooms.forEach((currentClassroom) => {
      currentClassroom.persons.forEach((person) => {
        if (
            !props.classroom?.id ||
            currentClassroom.id !== props.classroom.id
        ) {
          if (!studentsInOtherClassrooms.value.includes(person.id)) {
            studentsInOtherClassrooms.value.push(person.id);
          }
        }
      });
    });
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  } finally {
    isLoading.value = false;
  }
});

watch(() => props.classroom, (newClassroom) => {
  resetForm({values: newClassroom});
});

const togglePerson = (person) => {
  const index = personsField.value.findIndex((p) => p.id === person.id);
  if (index === -1) personsField.value.push(person);
  else personsField.value.splice(index, 1);
};

const isPersonSelected = (person) => personsField.value.some((p) => p.id === person.id);
const isPersonInAnotherClassroom = (person) => studentsInOtherClassrooms.value.includes(person.id);

const emitClassroomData = handleSubmit((values) => {
  emit("saveClassroomData", values);
  if (values.persons && values.persons.length > 0) {
    values.persons.forEach(person => {
      if (!studentsInOtherClassrooms.value.includes(person.id)) {
        studentsInOtherClassrooms.value.push(person.id);
      }
    });
  }
});

const searchQuery = ref('');
const filteredPeople = computed(() => {
  return people.value.filter(person =>
      person.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <form v-else @submit.prevent="emitClassroomData">
    <div class="my-5 space-y-5">
      <h1>Учебная группа</h1>
      <div>
        <label for="name" class="block mb-1">Название группы</label>
        <input class="my-input w-full" type="text" id="name" v-model="nameField" v-bind="nameAttrs"
               placeholder="Введите название группы">
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>
      <div>
        <p>Участники</p>
        <input type="text" v-model="searchQuery" class="my-input w-full mb-1" placeholder="Поиск по фамилии..."/>
        <div class="h-80 w-full border rounded-lg overflow-y-auto p-2 bg-formColor border-tertiary">
          <div v-if="filteredPeople.length > 0" v-for="person in filteredPeople" :key="person.id">
            <input type="checkbox" :value="person" :id="person.id" @change="togglePerson(person)"
                   :checked="isPersonSelected(person)" :disabled="isPersonInAnotherClassroom(person)" class="mr-2">
            <label :for="person.id">{{
                person.lastName + " " + person.firstName + " " + (person.patronymic ? person.patronymic : "")
              }}</label>
          </div>
          <div v-else>Пользователи не найдены</div>
        </div>
        <p v-if="errors.persons" class="error">{{ errors.persons }}</p>
      </div>
    </div>
    <button class="my-button mt-5">Сохранить</button>
  </form>
</template>