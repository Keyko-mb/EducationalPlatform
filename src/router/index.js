import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CurriculaView from '@/views/CurriculaView.vue'
import StudentHomeworkView from '@/views/StudentHomeworkView.vue'
import AccountView from '@/views/AccountView.vue'
import PeopleView from '@/views/PeopleView.vue'
import LessonView from '@/views/LessonView.vue'
import CurriculumSettingsView from "@/views/CurriculumSettingsView.vue";
import CurriculumView from "@/views/CurriculumView.vue";
import SignInView from "@/views/SignInView.vue";
import {useAuthStore} from "@/stores/auth.js";
import ClassroomsView from "@/views/ClassroomsView.vue";
import AccessDeniedView from "@/views/AccessDeniedView.vue";
import TeacherHomeworkView from "@/views/TeacherHomeworkView.vue";

const Role = {
  Admin: 'ADMIN',
  Teacher: 'TEACHER',
  Student: 'STUDENT'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signIn',
      name: 'signIn',
      component: SignInView,
      meta: {
          auth: false
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        auth: false
      }
    },
    {
      path: '/curricula',
      name: 'curricula',
      component: CurriculaView,
      meta: {
        auth: true
      }
    },
    {
      path: '/curricula/:id',
      name: 'curriculum',
      component: CurriculumView,
      meta: {
        auth: true
      }
    },
    {
      path: '/curricula/:id/settings',
      name: 'curriculumSettings',
      component: CurriculumSettingsView,
      meta: {
        auth: true,
        roles: [Role.Admin, Role.Teacher]
      }
    },
    {
      path: '/curricula/:curriculumId/courses/:courseId/lessons/:lessonId',
      name: 'lesson',
      component: LessonView,
      meta: {
        auth: true
      }
    },
    {
      path: '/curricula/:curriculumId/courses/:courseId/homeworks/:homeworkId',
      name: 'studentHomework',
      component: StudentHomeworkView,
      meta: {
        auth: true,
        roles: [Role.Student]
      }
    },
    {
      path: '/curricula/:curriculumId/courses/:courseId/homeworks/:homeworkId/teacher',
      name: 'teacherHomework',
      component: TeacherHomeworkView,
      meta: {
        auth: true,
        roles: [Role.Admin, Role.Teacher]
      }
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: {
        auth: true
      }
    },
    {
      path: '/people',
      name: 'people',
      component: PeopleView,
      meta: {
        auth: true,
        roles: [Role.Admin]
      }
    },
    // {
    //   path: '/people/:id/edit',
    //   name: 'editUser',
    //   component: PersonEditionView,
    //   meta: {
    //     auth: true
    //   }
    // },
    {
      path: '/classrooms',
      name: 'classrooms',
      component: ClassroomsView,
      meta: {
        auth: true,
        roles: [Role.Admin]
      }
    },
    {
      path: '/access-denied',
      component: AccessDeniedView
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.auth && !authStore.userInfo.token) {
    next('/signIn')
  }else if (to.name === 'signIn' && authStore.userInfo.token) {
    next('/')
  } else if (to.meta.roles && !to.meta.roles.includes(authStore.userInfo.role)) {
    next('/access-denied');
  } else {
    next()
  }
})

export default router
