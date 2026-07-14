<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          ></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </div>

      <h1 class="brand-title">KAuto Global ERP</h1>
      <p class="brand-subtitle">프로토타입 시스템 접속</p>

      <div class="button-group">
        <button class="auth-btn account-btn" @click="loginAccount">
          <span class="icon">💼</span>
          회계팀장으로 로그인
        </button>

        <button class="auth-btn sales-btn" @click="loginSales">
          <span class="icon">🤝</span>
          영업총괄로 로그인
        </button>
      </div>

      <div class="login-footer">© 2026 KAuto Global. All rights reserved.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/auth/store/useAuthStore'

const router = useRouter()
const auth = useAuthStore()

function loginAccount() {
  auth.loginAsAccountManager()
  router.push('/')
}

function loginSales() {
  auth.loginAsSalesManager()
  router.push('/')
}
</script>

<style scoped>
.login-page {
  /* 화면 전체를 채우고 중앙 정렬 */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-body);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-white);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-light);
  text-align: center;
}

.logo-icon {
  width: 48px;
  height: 48px;
  color: var(--color-primary);
  margin: 0 auto 1.5rem auto;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 0.9rem;
  color: var(--text-sub);
  margin: 0 0 2.5rem 0;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

/* 회계팀장 (Primary 컬러) */
.account-btn {
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
}
.account-btn:hover {
  background-color: #2563eb; /* hover 시 약간 어둡게 */
  transform: translateY(-1px);
}

/* 영업총괄 (Sub/Outline 스타일) */
.sales-btn {
  background-color: var(--bg-body);
  color: var(--text-main);
  border: 1px solid var(--border-light);
}
.sales-btn:hover {
  background-color: var(--color-primary-light);
  border-color: var(--border-hover);
  color: var(--color-primary);
}

.login-footer {
  margin-top: 2.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
