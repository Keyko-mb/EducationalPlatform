<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useForm } from "vee-validate";
import * as yup from "yup";

const emit = defineEmits(["saveClassroomData"]);
const props = defineProps({
  classroom: {
    type: Object,
    default: () => ({ name: "", persons: [] })
  }
});

const schema = yup.object({
  name: yup.string()
      .min(2, "Название класса должно содержать от 2 символов")
      .max(100, "Название класса должно содержать до 100 символов")
      .required("Название класса не может быть пустым"),
  persons: yup.array()
      .max(50, "Максимальное количество учеников в классе — 50")
      .nullable(),
});

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.classroom
});

const [nameField, nameAttrs] = defineField("name");
const [personsField] = defineField("persons");

watch(() => props.classroom, (newClassroom) => {
  resetForm({ values: newClassroom });
});

const people = ref([]);
const studentsInOtherClassrooms = ref([]);

onMounted(() => {
  axios.get("people").then((response) => {
    people.value = response.data;
  });

  axios.get("classrooms").then((response) => {
    const classrooms = response.data;
    classrooms.forEach((currentClassroom) => {
      currentClassroom.persons.forEach((person) => {
        if (
            !studentsInOtherClassrooms.value.includes(person.id) &&
            currentClassroom.id !== props.classroom.id // Исправлено
        ) {
          studentsInOtherClassrooms.value.push(person.id);
        }
      });
    });
  });
});

const togglePerson = (person) => {
  const index = personsField.value.findIndex((p) => p.id === person.id);
  if (index === -1) {
    personsField.value.push(person);
  } else {
    personsField.value.splice(index, 1);
  }
};

const isPersonSelected = (person) => {
  return personsField.value.some((p) => p.id === person.id);
};

const isPersonInAnotherClassroom = (person) => {
  return studentsInOtherClassrooms.value.includes(person.id);
};

const emitClassroomData = handleSubmit((values) => {
  emit("saveClassroomData", values);
});
</script>

<template>
  <form @submit.prevent="emitClassroomData">
    <div class="my-5 space-y-5">
      <h1>Учебная группа</h1>

      <div>
        <label for="name" class="block mb-1">Название группы</label>
        <input class="my-input w-full" type="text" id="name" v-model="nameField"
               v-bind="nameAttrs" aria-label="Поле для ввода названия учебной группы"
               placeholder="Введите название группы">
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div aria-labelledby="participants-label">
        <p id="participants-label">Участники</p>
        <div class="h-80 w-full border rounded-lg overflow-y-auto p-2 bg-formColor border-tertiary" role="listbox" aria-multiselectable="true">
          <div v-for="person in people" :key="person.id" role="option"
               :aria-selected="isPersonSelected(person)"
               :aria-disabled="isPersonInAnotherClassroom(person)">
            <input type="checkbox"
                   :value="person"
                   :id="person.id"
                   @change="togglePerson(person)"
                   :checked="isPersonSelected(person)"
                   :disabled="isPersonInAnotherClassroom(person)"
                   class="mr-2">
            <label :for="person.id">{{ person.lastName + " " + person.firstName + " " + person.patronymic }}</label>
          </div>
        </div>
        <p v-if="errors.persons" class="error">{{ errors.persons }}</p>
      </div>
    </div>

    <button class="my-button mt-5">Сохранить</button>
  </form>
</template>