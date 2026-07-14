import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/auth/store/useAuthStore'

// 라우트 정의
// router/index.ts 내의 routes 수정된 부분
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/login/view/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/mainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/features/export-management/view/ExportManagement.vue'),
      },
      {
        path: 'dealers',
        name: 'Dealers',
        component: () => import('@/features/dealers/view/DealersView.vue'),
      },
      {
        path: 'evidence',
        name: 'Evidence',
        component: () => import('@/features/document-management/view/DocumentManagement.vue'),
      },
      {
        path: 'employees',
        name: 'Employees',
        component: () => import('@/features/employee/view/EmployeeManagement.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 네비게이션 가드
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.user) {
    alert('로그인이 필요한 서비스입니다.')
    return '/login'
  }

  if (to.path === '/login' && auth.user) {
    return '/dashboard'
  }
})

export default router
