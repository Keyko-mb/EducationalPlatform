<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCurriculaStore } from '@/stores/curricula.js';
import { useMaterialsStore } from '@/stores/materials.js';

const route = useRoute();
const curriculaStore = useCurriculaStore();
const materialsStore = useMaterialsStore();

const excludedPaths = ['/signIn', '/not-found', '/access-denied'];

const breadcrumbs = computed(() => {
  // Если на главной странице – возвращаем пустой массив (в шаблоне будет показана только "Главная")
  if (excludedPaths.includes(route.path) || route.path === '/' || route.path === '') {
    return [];
  }

  const segments = route.path.split('/').filter(Boolean);
  const items = [];
  let accumulatedPath = '';
  const isNumeric = str => /^\d+$/.test(str);

  // Если маршрут начинается с "curricula", используем специальную логику
  if (segments[0].toLowerCase() === 'curricula') {
    // Добавляем первый элемент "Учебные программы"
    items.push({
      name: 'Учебные программы',
      path: '/curricula',
      clickable: true,
      isLast: false,
    });

    // Если есть ID учебной программы, добавляем его как breadcrumb
    if (segments.length >= 2 && isNumeric(segments[1])) {
      accumulatedPath = `/curricula/${segments[1]}`;
      const curriculum = curriculaStore.curricula.find(
          c => c.id.toString() === segments[1]
      );
      const curriculumName = curriculum ? curriculum.name : 'Программа';
      items.push({
        name: curriculumName,
        path: accumulatedPath,
        clickable: true,
        isLast: false,
      });
    } else if (segments.length >= 2) {
      // Если второй сегмент не числовой (на всякий случай)
      accumulatedPath = `/curricula/${segments[1]}`;
      items.push({
        name: segments[1],
        path: accumulatedPath,
        clickable: true,
        isLast: false,
      });
    }

    // Обрабатываем оставшиеся сегменты, начиная с третьего (index = 2)
    for (let i = 2; i < segments.length; i++) {
      const segment = segments[i];
      // Пропускаем сегменты "teacher"
      if (segment.toLowerCase() === 'teacher') {
        continue;
      }
      // Если текущий сегмент – один из ключевых (courses, lessons, homeworks)
      // и за ним следует числовой ID, объединяем их в один элемент
      if (
          (segment.toLowerCase() === 'courses' ||
              segment.toLowerCase() === 'lessons' ||
              segment.toLowerCase() === 'homeworks') &&
          i < segments.length - 1 &&
          isNumeric(segments[i + 1])
      ) {
        accumulatedPath += `/${segment}/${segments[i + 1]}`;
        let name = '';
        let clickable = true;

        if (segment.toLowerCase() === 'courses') {
          const course = materialsStore.courses.find(
              c => c.id.toString() === segments[i + 1]
          );
          name = course ? course.name : 'Курс';
          // Страницы курса не существует, делаем элемент не кликабельным
          clickable = false;
        } else if (segment.toLowerCase() === 'lessons') {
          const lesson = materialsStore.lessons.find(
              l => l.id.toString() === segments[i + 1]
          );
          name = lesson ? lesson.name : 'Урок';
        } else if (segment.toLowerCase() === 'homeworks') {
          const homework = materialsStore.homeworks.find(
              hw => hw.id.toString() === segments[i + 1]
          );
          name = homework ? homework.name : 'Домашнее задание';
        }

        items.push({
          name,
          path: clickable ? accumulatedPath : '',
          clickable,
          isLast: false,
        });
        i++; // Пропускаем числовой ID
        continue;
      }
      else {
        // Для остальных сегментов
        accumulatedPath += '/' + segment;
        let name = segment;
        // Возможные дополнительные переводы для сегментов
        switch (segment.toLowerCase()) {
          case 'settings':
            name = 'Настройки';
            break;
        }
        // Если сегмент является числом, не добавляем его
        if (!isNumeric(segment)) {
          items.push({
            name,
            path: accumulatedPath,
            clickable: true,
            isLast: false,
          });
        }
      }
    }
  } else {
    // Обрабатываем маршруты, которые НЕ начинаются с "curricula"
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.toLowerCase() === 'teacher') {
        continue;
      }
      accumulatedPath += '/' + segment;
      let name = segment;
      // Переводим ключевые сегменты на русский язык
      switch (segment.toLowerCase()) {
        case 'settings':
          name = 'Настройки';
          break;
        case 'classrooms':
          name = 'Учебные группы';
          break;
        case 'account':
          name = 'Личный кабинет';
          break;
        case 'people':
          name = 'Пользователи';
          break;
      }
      if (!isNumeric(segment)) {
        items.push({
          name,
          path: accumulatedPath,
          clickable: true,
          isLast: false,
        });
      }
    }
  }

  if (items.length) {
    items[items.length - 1].isLast = true;
  }
  return items;
});
</script>

<template>
  <nav v-if="breadcrumbs.length" aria-label="Навигация по сайту" class="mb-4 py-1 overflow-auto">
    <ol class="flex gap-1">
      <!-- "Главная" всегда отображается -->
      <li>
        <router-link to="/" class="text-breadcrumbColor hover:brightness-125 mr-1">
          Главная
        </router-link>
      </li>
      <li v-for="(item, index) in breadcrumbs" :key="index" class="text-nowrap">
        <span>/</span>
        <template v-if="item.isLast || !item.clickable">
          <span class="text-gray-500 mx-1 text-nowrap">{{ item.name }}</span>
        </template>
        <template v-else>
          <router-link :to="item.path" class="text-breadcrumbColor hover:brightness-125 mx-1">
            {{ item.name }}
          </router-link>
        </template>
      </li>
    </ol>
  </nav>
</template>
