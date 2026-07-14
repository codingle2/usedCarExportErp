<template>
  <aside class="sidebar">
    <!-- 브랜드 -->
    <div class="brand">
      <div class="brand-logo">K</div>

      <div class="brand-info">
        <h2>KAuto Global</h2>
        <span>중고차 수출 ERP</span>

        <div class="status">
          <span class="status-dot"></span>
          시스템 정상 운영
        </div>
      </div>
    </div>

    <!-- 메뉴 -->
    <nav class="menu">
      <router-link
        v-for="menu in menuList"
        :key="menu.path"
        :to="menu.path"
        class="menu-item"
        active-class="active"
      >
        <div class="menu-icon">
          <component :is="menu.icon" :size="20" />
        </div>

        <div class="menu-content">
          <div class="menu-title">
            {{ menu.label }}
          </div>

          <div class="menu-desc">
            {{ menu.desc }}
          </div>
        </div>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, PersonStanding, FileCheck, Users } from 'lucide-vue-next'

const menuList = [
  {
    label: '대시보드',
    desc: '전체 현황',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    label: '딜러 관리',
    desc: '딜러 정보',
    icon: PersonStanding,
    path: '/dealers',
  },
  {
    label: '증빙 관리',
    desc: '수출 서류',
    icon: FileCheck,
    path: '/evidence',
  },
  {
    label: '사원 관리',
    desc: '직원 관리',
    icon: Users,
    path: '/employees',
  },
]
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
}

/* =========================
   Brand
========================= */

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 36px;
}

.brand-logo {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.25);
}

.brand-info h2 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.brand-info span {
  color: #64748b;
  font-size: 13px;
}

.status {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  color: #16a34a;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
}

/* =========================
   Menu
========================= */

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  padding: 14px;
  border-radius: 16px;
  transition: all 0.25s ease;
  color: #475569;
}

.menu-item:hover {
  background: white;
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.menu-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  color: #2563eb;
  transition: 0.25s;
}

.menu-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.menu-desc {
  margin-top: 3px;
  font-size: 12px;
  color: #94a3b8;
}

/* =========================
   Active
========================= */

.active {
  background: white;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  position: relative;
}

.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  border-radius: 0 10px 10px 0;
  background: #2563eb;
}

.active .menu-icon {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.active .menu-title {
  color: #2563eb;
}
</style>
