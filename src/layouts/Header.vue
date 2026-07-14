<template>
  <header class="global-header">
    <div class="header-titles">
      <h1 class="page-title">{{ title }}</h1>
      <p class="page-desc">{{ description }}</p>
    </div>

    <div class="header-actions">
      <div class="notification-wrapper" ref="dropdownRef">
        <div class="notification-trigger" @click="toggleDropdown">
          <span class="bell-icon">🔔</span>
          <span v-if="notiStore.unreadCount > 0" class="badge">
            {{ notiStore.unreadCount > 99 ? '99+' : notiStore.unreadCount }}
          </span>
        </div>

        <div v-if="isDropdownOpen" class="notification-dropdown">
          <div class="dropdown-header">
            <h3>알림 센터</h3>
            <button class="clear-btn" @click="notiStore.clearAll">모두 지우기</button>
          </div>

          <div class="dropdown-body">
            <div v-if="notiStore.sortedNotifications.length === 0" class="empty-state">
              새로운 알림이 없습니다.
            </div>

            <div
              v-for="noti in notiStore.sortedNotifications"
              :key="noti.id"
              class="noti-item"
              :class="{ 'is-read': noti.isRead }"
              @click="notiStore.markAsRead(noti.id)"
            >
              <div class="noti-icon">{{ getLevelIcon(noti.event.level) }}</div>
              <div class="noti-content">
                <p class="noti-msg">{{ noti.event.message }}</p>
                <p v-if="noti.event.context" class="noti-context">
                  {{ noti.event.context.model }} ({{ noti.event.context.vin }})
                </p>
                <span class="noti-time">{{ formatTime(noti.createdAt) }}</span>
              </div>
              <div v-if="!noti.isRead" class="unread-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="user-profile" @click="toggleUserMenu" ref="userMenuRef">
        <div class="avatar"></div>
        <div class="user-info">
          <span class="user-name"> {{ authStore.user?.name }} {{ authStore.user?.position }} </span>
          <span class="user-team">{{ authStore.user?.department }}</span>
        </div>
        <span class="chevron">▼</span>

        <div v-if="isUserMenuOpen" class="user-dropdown">
          <button class="dropdown-item logout" @click.stop="logout">🚪 로그아웃</button>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/features/export-management/store/useNotificationStore'
import { useAuthStore } from '@/auth/store/useAuthStore'
import { NOTI_LEVEL } from '@/constants/notification.constants'
import router from '@/router'

const authStore = useAuthStore()

const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null) // 추가

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

interface HeaderProps {
  title?: string
  description?: string
}

withDefaults(defineProps<HeaderProps>(), {
  title: '수출 진행 관리',
  description: '차량별 수출 진행 현황을 한눈에 관리하세요.',
})

const notiStore = useNotificationStore()
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  // 알림 드롭다운 영역 밖이면서, 동시에 유저 메뉴 영역 밖인 경우에만 닫도록 수정
  const isClickOutsideNoti = dropdownRef.value && !dropdownRef.value.contains(event.target as Node)
  const isClickOutsideUser = userMenuRef.value && !userMenuRef.value.contains(event.target as Node)

  if (isClickOutsideNoti && isClickOutsideUser) {
    isDropdownOpen.value = false
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// 2. NOTI_LEVEL로 아이콘 매핑 조건 변경
const getLevelIcon = (level: number) => {
  if (level === NOTI_LEVEL.CRITICAL) return '🚨'
  if (level === NOTI_LEVEL.WARNING) return '⚠️'
  return '💡'
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}
</script>

<style scoped>
/* 기존 글로벌 헤더 스타일 유지... */
.global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border-light);
}
.header-titles {
  display: flex;
  flex-direction: column;
}
.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text-dark);
}
.page-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
  margin: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding-left: 1.5rem;
  border-left: 1px solid var(--border-light);
  position: relative;
}
.avatar {
  width: 36px;
  height: 36px;
  background: var(--border-light);
  border-radius: 50%;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-dark);
}
.user-team {
  font-size: 0.75rem;
  color: var(--text-sub);
}
.chevron {
  font-size: 0.7rem;
  color: var(--text-sub);
}

.notification-wrapper {
  position: relative;
}

.notification-trigger {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.notification-trigger:hover {
  background: var(--bg-body);
}

.bell-icon {
  font-size: 1.25rem;
}

.badge {
  position: absolute;
  top: 2px;
  right: 0px;
  background: var(--color-danger);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 10px;
  border: 2px solid var(--bg-white); /* 겹치는 부분 투명화 효과 */
}

/* 알림 드롭다운 */
.notification-dropdown {
  position: absolute;
  top: 120%;
  right: -50px;
  width: 320px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-body);
}

.dropdown-header h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
}

.clear-btn {
  background: none;
  border: none;
  font-size: 0.75rem;
  color: var(--text-sub);
  cursor: pointer;
}
.clear-btn:hover {
  color: var(--color-primary);
}

.dropdown-body {
  max-height: 380px;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.noti-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.noti-item:hover {
  background: var(--bg-body);
}
.noti-item.is-read {
  opacity: 0.6;
}

.noti-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.noti-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.noti-msg {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-dark);
  line-height: 1.3;
}

.noti-context {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 500;
}

.noti-time {
  font-size: 0.7rem;
  color: var(--text-sub);
}

.unread-dot {
  position: absolute;
  top: 1.2rem;
  right: 1.25rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
}

.user-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  width: 180px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 100;
}

.dropdown-item {
  width: 100%;
  border: none;
  background: white;
  padding: 14px 18px;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}

.dropdown-item:hover {
  background: var(--bg-body);
}

.logout {
  color: #ef4444;
}

.logout:hover {
  background: #fef2f2;
}
</style>
