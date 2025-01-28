<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const emit = defineEmits(['saveClassroomData'])
const props = defineProps({
  classroom: {
    type: Object,
    default: () => ({ name: '', persons: [] }) // Объект по умолчанию
  }
});
const classroom = ref({
  ...props.classroom,
  persons: props.classroom.persons ? [...props.classroom.persons] : [] // Инициализация пустого массива, если нет persons
});
const people = ref([])
const studentsInOtherClassrooms = ref([]);

const emitClassroomData = () => {
  emit('saveClassroomData', classroom.value)
}

onMounted(() => {
  axios.get('people').then((response) => {
    people.value = response.data
  })

  axios.get('classrooms').then((response) => {
    const classrooms = response.data;
    classrooms.forEach(currentClassroom => {
      currentClassroom.persons.forEach(person => {
        if (!studentsInOtherClassrooms.value.includes(person.id) && currentClassroom.id !== classroom.value.id) {
          studentsInOtherClassrooms.value.push(person.id);
        }
      });
    });
  });
})

const togglePerson = (person) => {
  const index = classroom.value.persons.findIndex(p => p.id === person.id);
  if (index === -1) {
    classroom.value.persons.push(person);
  } else {
    classroom.value.persons.splice(index, 1);
  }
}

const isPersonSelected = (person) => {
  return classroom.value.persons.some(p => p.id === person.id);
}

const isPersonInAnotherClassroom = (person) => {
  return studentsInOtherClassrooms.value.includes(person.id);
};

</script>

<template>
  <form  @submit.prevent="emitClassroomData">
    <div class="my-5 space-y-5">
      <h1>Учебная группа</h1>

      <div>
        <label for="name" class="block mb-1">Название группы</label>
        <input class="my-input w-full" type="text" id="name" v-model="classroom.name" aria-label="Поле для ввода названия учебной группы">
      </div>
      <div aria-labelledby="participants-label">
        <p id="participants-label">Участники</p>
        <div class="h-80 w-full border rounded-lg overflow-y-auto p-2 bg-formColor border-tertiary" role="listbox" aria-multiselectable="true">
          <div v-for="person in people" :key="person.id" role="option"
               :aria-selected="isPersonSelected(person)"
               :aria-disabled="isPersonInAnotherClassroom(person)"
          >
            <input type="checkbox"
                   :value="person"
                   :id="person.id"
                   @change="togglePerson(person)"
                   :checked="isPersonSelected(person)"
                   :disabled="isPersonInAnotherClassroom(person)"
                   class="mr-2">
<!--                   :aria-describedby="isPersonInAnotherClassroom(person) ? 'disabled-reason' : undefined"-->
            <label :for="person.id">{{person.lastName + ' ' + person.firstName + ' ' + person.patronymic}}</label>
          </div>
        </div>
      </div>
    </div>

    <button class="my-button mt-5">Сохранить</button>

<!--    <div id="disabled-reason" class="sr-only">-->
<!--      Пользователь уже состоит в другой учебной группе-->
<!--    </div>-->
  </form>
</template>

<style scoped>

</style>