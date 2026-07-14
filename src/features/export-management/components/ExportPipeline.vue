<template>
  <section class="pipeline-section">
    <header class="section-header">
      <h3 class="section-title">🚀 수출 선적 파이프라인</h3>
      <p class="section-desc">
        차량이 선적 가능 상태가 되기 위해 통과해야 하는 결점 검수 단계입니다.
      </p>
    </header>

    <div class="pipeline-cards">
      <div
        class="stat-card all-zone"
        :class="{ active: store.filters.tab === EXPORT_TABS.ALL }"
        @click="store.setTab(EXPORT_TABS.ALL)"
      >
        <div class="stat-label">전체 재고</div>
        <div class="stat-value">
          <span class="num">{{ store.getCount(EXPORT_TABS.ALL) }}</span
          ><span class="unit">대</span>
        </div>
      </div>

      <span class="arrow">➔</span>

      <div
        class="stat-card danger-zone"
        :class="{ active: store.filters.tab === EXPORT_TABS.MISSING_DOCS }"
        @click="store.setTab(EXPORT_TABS.MISSING_DOCS)"
      >
        <div class="stat-label"><span class="step-badge bg-red">1</span> 증빙 / 재무 미흡</div>
        <div class="stat-sub-text">현금영수증 미발행 · 역마진</div>
        <div class="stat-value text-red">
          <span class="num">{{ store.getCount(EXPORT_TABS.MISSING_DOCS) }}</span
          ><span class="unit">대</span>
        </div>
      </div>

      <span class="arrow">➔</span>

      <div
        class="stat-card warning-zone"
        :class="{ active: store.filters.tab === EXPORT_TABS.RISK_WARNING }"
        @click="store.setTab(EXPORT_TABS.RISK_WARNING)"
      >
        <div class="stat-label"><span class="step-badge bg-orange">2</span> 법적 / 세무 리스크</div>
        <div class="stat-sub-text">VIN 압류 · 부가세 기한 임박</div>
        <div class="stat-value text-orange">
          <span class="num">{{ store.getCount(EXPORT_TABS.RISK_WARNING) }}</span
          ><span class="unit">대</span>
        </div>
      </div>

      <span class="arrow">➔</span>

      <div
        class="stat-card hold-zone"
        :class="{ active: store.filters.tab === EXPORT_TABS.PENDING_APPROVAL }"
        @click="store.setTab(EXPORT_TABS.PENDING_APPROVAL)"
      >
        <div class="stat-label"><span class="step-badge bg-yellow">3</span> 회계 승인 대기</div>
        <div class="stat-sub-text">회계팀 직권 보류 (해제 대기)</div>
        <div class="stat-value text-yellow">
          <span class="num">{{ store.getCount(EXPORT_TABS.PENDING_APPROVAL) }}</span
          ><span class="unit">대</span>
        </div>
      </div>

      <span class="arrow">➔</span>

      <div
        class="stat-card ready-zone"
        :class="{ active: store.filters.tab === EXPORT_TABS.READY_TO_SHIP }"
        @click="store.setTab(EXPORT_TABS.READY_TO_SHIP)"
      >
        <div class="stat-label"><span class="step-badge bg-green">4</span> 선적 가능 (Clear)</div>
        <div class="stat-sub-text">모든 조건 충족 · 즉시 선적 요망</div>
        <div class="stat-value text-green">
          <span class="num">{{ store.getCount(EXPORT_TABS.READY_TO_SHIP) }}</span
          ><span class="unit">대</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useExportStore } from '../store/useExportStore'
import { EXPORT_TABS } from '@/constants/export.constants'

const store = useExportStore()
</script>

<style scoped>
.all-zone:hover {
  border-color: #93c5fd;
}
.all-zone.active {
  border-color: var(--color-primary);
  background: #eff6ff; /* 약간의 파란 배경으로 통일감 부여 */
}
.pipeline-section {
  padding: 2rem 2.5rem 1rem 2.5rem;
}
.section-header {
  margin-bottom: 1rem;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 0.25rem 0;
}
.section-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
  margin: 0;
}
.pipeline-cards {
  display: flex;
  align-items: stretch; /* 카드들의 높이를 동일하게 맞춤 */
  gap: 0.75rem;
  background: var(--bg-white);
  padding: 1.5rem;
  border: 1px solid var(--border-light);
  border-radius: 12px;

  overflow-x: auto;
  flex-wrap: nowrap; /* 줄바꿈 방지 */
  -webkit-overflow-scrolling: touch; /* 모바일 부드러운 스크롤 */
}

.stat-card {
  flex: 0 0 auto;
  width: 220px; /* 카드가 찌그러지지 않도록 고정 너비 부여 */

  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border: 2px solid var(--border-light);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: var(--bg-body);
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 각 구역별 상태 컬러링 */
.danger-zone:hover {
  border-color: #fca5a5;
}
.danger-zone.active {
  border-color: #ef4444;
  background: #fef2f2;
}

.warning-zone:hover {
  border-color: #fcd34d;
}
.warning-zone.active {
  border-color: #f59e0b;
  background: #fffbeb;
}

.hold-zone:hover {
  border-color: #fde047;
}
.hold-zone.active {
  border-color: #eab308;
  background: #fefce8;
}

.ready-zone:hover {
  border-color: #86efac;
}
.ready-zone.active {
  border-color: #22c55e;
  background: #f0fdf4;
}

.stat-card.active:not(.danger-zone):not(.warning-zone):not(.hold-zone):not(.ready-zone) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.stat-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}
.stat-sub-text {
  font-size: 0.75rem;
  color: var(--text-sub);
  margin-bottom: 1rem;
  height: 1.2rem;
}

.step-badge {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
}

/* 텍스트 및 뱃지 컬러 유틸리티 */
.bg-red {
  background: #ef4444;
}
.bg-orange {
  background: #f59e0b;
}
.bg-yellow {
  background: #eab308;
}
.bg-green {
  background: #22c55e;
}

.text-red {
  color: #ef4444;
}
.text-orange {
  color: #f59e0b;
}
.text-yellow {
  color: #eab308;
}
.text-green {
  color: #22c55e;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
}
.stat-value .unit {
  font-size: 1rem;
  font-weight: 600;
  margin-left: 0.2rem;
}

.arrow {
  flex: 0 0 auto;
  color: #cbd5e1;
  font-size: 1.5rem;
  font-weight: 900;
  display: flex;
  align-items: center;
}
</style>
