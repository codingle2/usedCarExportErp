<template>
  <Teleport to="body">
    <div class="drawer-overlay" v-if="isOpen" @click="close"></div>

    <div class="drawer" :class="{ 'is-open': isOpen }">
      <div class="drawer-content">
        <header class="drawer-header">
          <div>
            <h2 class="drawer-title">{{ title }}</h2>
            <p class="drawer-subtitle" v-if="subtitle">{{ subtitle }}</p>
          </div>
          <button class="close-btn" @click="close">✕</button>
        </header>

        <div class="drawer-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
  subtitle?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>

<style scoped>
/* 중복되던 서랍장 CSS를 이곳에 전부 모아줍니다. */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 100;
  backdrop-filter: blur(2px);
}
.drawer {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.05);
  z-index: 101;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}
.drawer.is-open {
  transform: translateX(0);
}
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.drawer-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8fafc;
}
.drawer-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}
.drawer-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
}
.drawer-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 섹션 간격 통일 */
}
</style>
