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
import {useCurriculaStore} from "@/stores/curricula.js";
import {useMaterialsStore} from "@/stores/materials.js";
import NotFoundView from "@/views/NotFoundView.vue";

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
      name: 'access-denied',
      component: AccessDeniedView
    },
    { path: "/404",
      name: "not-found",
      component: NotFoundView
    },
    { path: "/:pathMatch(.*)*",
      redirect: "/404"
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.auth && !authStore.userInfo.token) {
    next('/signIn')
    return;
  }
  if (to.name === 'signIn' && authStore.userInfo.token) {
    next('/')
    return;
  }
  if (to.meta.roles && !to.meta.roles.includes(authStore.userInfo.role)) {
    next('/access-denied');
    return;
  }
  const curriculaStore = useCurriculaStore();
  const materialsStore = useMaterialsStore();

  if (to.path.startsWith('/curricula/')) {
    if (curriculaStore.curricula.length < 1) {
      await curriculaStore.fetchCurricula();
    }

    const curriculumId = to.params.id || to.params.curriculumId;
    const curriculum = curriculaStore.curricula.find(curriculum => curriculum.id.toString() === curriculumId);

    if (!curriculum || (authStore.userInfo.role === 'STUDENT' && !curriculum.access)) {
      next('/access-denied');
      return;
    }
  }

  if (to.path.includes('/courses/')) {
    if (materialsStore.courses.length < 1) {
      await materialsStore.fetchCourses();
    }

    const courseId = to.params.courseId;
    const course = materialsStore.courses.find(course => course.id.toString() === courseId);

    if (!course || (authStore.userInfo.role === 'STUDENT' && !course.access)) {
      next('/access-denied');
      return;
    }
  }

  if (to.path.includes('/lessons/')) {
    if (materialsStore.lessons.length < 1) {
      await materialsStore.fetchLessons();
    }

    const lessonId = to.params.lessonId;
    const lesson = materialsStore.lessons.find(lesson => lesson.id.toString() === lessonId);

    if (!lesson || (authStore.userInfo.role === 'STUDENT' && !lesson.access)) {
      next('/access-denied');
      return;
    }
  }

  if (to.path.includes('/homeworks/')) {
    if (materialsStore.homeworks.length < 1) {
      await materialsStore.fetchHomeworks();
    }

    const homeworkId = to.params.homeworkId;
    const homework = materialsStore.homeworks.find(hw => hw.id.toString() === homeworkId);

    if (!homework || (authStore.userInfo.role === 'STUDENT' && !homework.access)) {
      next('/access-denied');
      return;
    }
  }

  next();
})

export default router
