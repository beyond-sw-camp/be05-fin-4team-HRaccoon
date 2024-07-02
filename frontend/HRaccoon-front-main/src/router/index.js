import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/BlankLayout.vue'),
      children: [
        {
          path: 'sign-in',
          name: 'SignIn',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'test',
          name: 'Test',
          component: () => import('@/views/dev/TestView.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/views/exception/ErrorView.vue'),
        },
      ],
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: 'home',
          component: () => import('@/views/home/HomeView.vue'),
        },
        {
          path: 'mypage',
          name: 'MyPage',
          component: () => import('@/views/user/MypageView.vue'),
        },
        /* 👉 근태 */
        {
          path: 'attendance',
          component: () => import('@/views/attendance/AttendanceView.vue'),
        },
        /* 👉 결재 */
        {
          path: 'approval/request',
          component: () => import('@/views/approval/RequestApprovalView.vue'),
        },
        {
          path: 'approval/request/list',
          component: () => import('@/views/approval/RequestApprovalListView.vue'),
        },
        {
          path: 'approval/details/:approvalNo',
          component: () => import('@/views/approval/ApprovalDetailView.vue'),
          props: route => ({ approvalNo: route.params.approvalNo, type: route.query.type }),
        },
        {
          path: 'approval/status/list',
          component: () => import('@/views/approval/ApprovalStatusListView.vue'),
        },
        /* 👉 직원 조회 */
        {
          path: 'search',
          component: () => import('@/views/search/EmployeeSearch.vue'),
        },
        {
          path: 'search/:userId',
          component: () => import('@/views/search/EmployeeView.vue'),
          props: route => ({ userId: route.params.userId, type: route.query.type }),
        },
        /* 👉 좌석 */
        {
          path: 'seat',
          component: () => import('@/views/SeatView.vue'),
        },

        /* 👉 관리자 */
        {
          path: '/admin/employee/list',
          component: () => import('@/views/admin/AdminEmployeeSearch.vue'),
        },
        {
          path: '/admin/employee/register',
          component: () => import('@/views/admin/EmployeeRegisterView.vue'),
        },
        {
          path: '/admin/employee/edit/:userId',
          component: () => import('@/views/admin/AdminEmployeeView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = !!sessionStorage.getItem('accessToken')

  if (!isLoggedIn && to.name !== 'SignIn') {
    if (to.name === 'Test') {
      next()
    } else {
      next({ name: 'SignIn' })
    }
  } else {
    next()
  }

  if (
    (authStore.authority === 'ADMIN' && to.path === '/admin/employee/list') ||
    to.path === '/admin/employee/register' ||
    to.path === '/admin/employee/edit/:userId'
  ) {
    next()
  } else {
    next({ name: 'NotFound' })
  }
})

export default router
