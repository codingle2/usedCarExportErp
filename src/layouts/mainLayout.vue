<template>
  <div class="app-layout">
    <Sidebar />
    <div class="main-content">
      <Header />
      <main class="page-container">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>
<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-container {
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
</style>
