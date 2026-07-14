<template>
  <div class="list-controls">
    <div class="control-header">
      <h3 class="section-title">차량 목록</h3>
      <button class="btn-reset" @click="store.resetFilters" title="모든 조건 초기화">
        <span class="icon">↺</span> 초기화
      </button>
    </div>

    <div class="filter-actions">
      <select class="filter-select" v-model="store.filters.docStatus">
        <option value="전체 상태">증빙 상태 (전체)</option>
        <option value="완비">완비</option>
        <option value="일부 누락">일부 누락</option>
      </select>

      <select class="filter-select" v-model="store.filters.riskStatus">
        <option value="all">리스크 현황 (전체)</option>
        <option value="safe">안전 (Safe)</option>
        <option value="risk">위험 감지</option>
      </select>

      <div class="search-input-wrapper">
        <input
          v-model="store.filters.query"
          type="text"
          placeholder="차종, VIN, 담당자, 매입처 검색"
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExportStore } from '../store/useExportStore'
const store = useExportStore()
</script>

<style scoped>
.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.control-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: 1px solid var(--border-light);
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-sub);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: var(--bg-body);
  color: var(--text-dark);
  border-color: var(--border-hover);
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  background: var(--bg-white);
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 280px; /* 검색 범위가 늘어났으므로 너비를 살짝 넓힙니다 */
  padding: 0.5rem 1rem 0.5rem 2.2rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  background: var(--bg-white);
  font-size: 0.85rem;
  outline: none;
}

.search-input:focus {
  border-color: var(--color-primary);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}
</style>
