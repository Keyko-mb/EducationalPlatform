import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CurriculaView from '@/views/CurriculaView.vue'
import HomeworkView from '@/views/HomeworkView.vue'
import AccountView from '@/views/AccountView.vue'
import PeopleView from '@/views/PeopleView.vue'
import LessonView from '@/views/LessonView.vue'
import CurriculumCreationView from "@/views/CurriculumCreationView.vue";
import PersonEditionView from "@/views/PersonEditionView.vue";
import PersonCreationView from "@/views/PersonCreationView.vue";
import LessonEditionView from "@/views/LessonEditionView.vue";
import HomeworkEditionView from "@/views/HomeworkEditionView.vue";
import LessonCreationView from "@/views/LessonCreationView.vue";
import HomeworkCreationView from "@/views/HomeworkCreationView.vue";
import CurriculumSettingsView from "@/views/CurriculumSettingsView.vue";
import CurriculumView from "@/views/CurriculumView.vue";
import CourseCreationView from "@/views/CourseCreationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/curricula',
      name: 'curricula',
      component: CurriculaView
    },
    {
      path: '/curricula/:id',
      name: 'curriculum',
      component: CurriculumView
    },
    {
      path: '/curricula/:id/settings',
      name: 'curriculumSettings',
      component: CurriculumSettingsView
    },
    {
      path: '/curricula/:curriculumId/settings/courses/create',
      name: 'createCourse',
      component: CourseCreationView
    },
    {
      path: '/curricula/:curriculumId/lessons/:lessonId',
      name: 'lesson',
      component: LessonView
    },
    {
      path: '/curricula/:curriculumId/homeworks/:homeworkId:',
      name: 'homework',
      component: HomeworkView
    },
    {
      path: '/lessons/create',
      name: 'createLesson',
      component: LessonCreationView
    },
    {
      path: '/homeworks/create',
      name: 'createHomework',
      component: HomeworkCreationView
    },
    {
      path: '/lessons/:lessonId/edit',
      name: 'editLesson',
      component: LessonEditionView
    },
    {
      path: '/homeworks/:homeworkId:/edit',
      name: 'editHomework',
      component: HomeworkEditionView
    },
    {
      path: '/curricula/create',
      name: 'createCurriculum',
      component: CurriculumCreationView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    },
    {
      path: '/people',
      name: 'people',
      component: PeopleView
    },
    {
      path: '/people/add',
      name: 'addUser',
      component: PersonCreationView
    },
    {
      path: '/people/:id/edit',
      name: 'editUser',
      component: PersonEditionView
    },
  ]
})

export default router
