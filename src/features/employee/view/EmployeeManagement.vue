<template>
  <section class="page-container">
    <header class="page-header">
      <div class="header-title-group">
        <h1 class="page-title">👥 사원 및 권한 관리(기능은 구현없습니다.)</h1>
        <p class="page-desc">시스템 접근 권한과 사원 정보를 관리합니다.</p>
      </div>

      <div class="dev-auth-switcher">
        <div class="current-user">
          <span class="status-dot" :class="{ 'is-active': authStore.isLogin }"></span>
          <span
            >현재 접속: <strong>{{ authStore.user?.name || '비로그인' }}</strong></span
          >
          <span class="text-sub ms-1" v-if="authStore.user">({{ authStore.user.position }})</span>
        </div>
        <div class="auth-buttons">
          <button
            class="btn-outline-sm"
            :class="{ 'active-auth': authStore.isAccountManager }"
            @click="authStore.loginAsAccountManager()"
          >
            회계팀장 로그인
          </button>
          <button
            class="btn-outline-sm"
            :class="{ 'active-auth': authStore.isSalesManager }"
            @click="authStore.loginAsSalesManager()"
          >
            영업총괄 로그인
          </button>
          <button
            class="btn-outline-sm text-sub"
            @click="authStore.logout()"
            v-if="authStore.isLogin"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <div class="content-toolbar">
      <div class="filter-group">
        <select class="select-sm">
          <option>전체 부서</option>
          <option>회계팀</option>
          <option>영업팀</option>
        </select>
        <select class="select-sm">
          <option>전체 권한</option>
          <option>ACCOUNT_MANAGER</option>
          <option>SALES_MANAGER</option>
          <option>일반 사원</option>
        </select>
      </div>
      <button class="btn-primary" @click="registerEmployee">
        <span class="icon">+</span> 신규 사원 등록
      </button>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>사원번호</th>
            <th>이름</th>
            <th>부서</th>
            <th>직급</th>
            <th class="text-center">시스템 권한</th>
            <th class="text-center">상태</th>
            <th class="text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="emp in employeeList"
            :key="emp.id"
            :class="{ 'row-highlight': authStore.user?.id === emp.id }"
          >
            <td class="tabular-nums text-sub">{{ emp.id.padStart(5, '0') }}</td>
            <td>
              <strong>{{ emp.name }}</strong>
              <span v-if="authStore.user?.id === emp.id" class="me-badge">내 계정</span>
            </td>
            <td>{{ emp.department }}</td>
            <td>{{ emp.position }}</td>
            <td class="text-center">
              <span class="status-badge" :class="getRoleBadgeClass(emp.role)">
                {{ emp.role || '일반 (권한 없음)' }}
              </span>
            </td>
            <td class="text-center">
              <span
                class="status-dot is-active"
                style="display: inline-block; margin-right: 4px"
              ></span>
              재직중
            </td>
            <td class="text-center">
              <button class="btn-outline-sm">수정</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/auth/store/useAuthStore'
import { UserRole } from '@/auth/types/auth.types'
import { accountManager, salesManager } from '@/auth/mock/users'

// 스토어 연결
const authStore = useAuthStore()

// 가상 사원 데이터
const employeeList = ref([
  accountManager, // id: '1', 회계팀장
  salesManager, // id: '2', 영업총괄
  {
    id: '3',
    name: '박지원',
    department: '회계팀',
    position: '대리',
    role: null, // 일반 사원 (특수 시스템 권한 없음)
  },
  {
    id: '4',
    name: '정민수',
    department: '영업팀',
    position: '과장',
    role: null,
  },
  {
    id: '5',
    name: '최하나',
    department: '영업팀',
    position: '사원',
    role: null,
  },
])

// 권한에 따른 뱃지 색상 부여
const getRoleBadgeClass = (role: UserRole | null | undefined) => {
  if (role === UserRole.ACCOUNT_MANAGER) return 'bg-purple'
  if (role === UserRole.SALES_MANAGER) return 'bg-blue'
  return 'bg-gray'
}

// 액션 핸들러
const registerEmployee = () => {
  alert('신규 사원 등록 모달이 열립니다.')
}
</script>

<style scoped>
/* 페이지 기본 설정 */
.page-container {
  padding: 2rem 2.5rem;
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
}

/* 헤더 영역 */
.page-header,
.content-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.header-title-group .page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}
.header-title-group .page-desc {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* 🚀 개발용 인증 스위처 디자인 */
.dev-auth-switcher {
  flex: 0 0 auto;
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
}
.current-user {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.auth-buttons {
  display: flex;
  gap: 0.5rem;
}
.active-auth {
  background: #eff6ff !important;
  border-color: #3b82f6 !important;
  color: #2563eb !important;
  font-weight: 700 !important;
}

.filter-group {
  flex: 0 0 auto;
  display: flex;
  gap: 0.5rem;
}
.select-sm {
  padding: 0.4rem 0.6rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  outline: none;
  font-size: 0.85rem;
  color: #475569;
}

/* 테이블 영역 */
.table-wrapper {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  overflow-x: auto;
}
.data-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 0.9rem;
  white-space: nowrap;
}
.data-table th,
.data-table td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-align: left;
}
.data-table tbody tr:hover {
  background: #f1f5f9;
}
.row-highlight {
  background: #f0fdf4 !important; /* 내 계정 행 하이라이트 */
}

/* 유틸리티 및 뱃지 */
.text-sub {
  color: #64748b;
}
.ms-1 {
  margin-left: 0.25rem;
}
.text-center {
  text-align: center;
}
.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-family: monospace;
}

.me-badge {
  font-size: 0.7rem;
  background: #22c55e;
  color: white;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  font-weight: 700;
}

.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  display: inline-block;
}
.bg-purple {
  background: #8b5cf6;
}
.bg-blue {
  background: #3b82f6;
}
.bg-gray {
  background: #94a3b8;
  color: #f8fafc;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
}
.status-dot.is-active {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

/* 버튼 디자인 */
.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.btn-primary:hover {
  background: #1d4ed8;
}
.btn-outline-sm {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #334155;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline-sm:hover {
  background: #f8fafc;
}
</style>
