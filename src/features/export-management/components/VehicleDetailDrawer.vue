<template>
  <GlobalDrawer
    :is-open="store.isDrawerOpen"
    :title="store.selectedVehicle?.model || '차량 상세'"
    :subtitle="store.selectedVehicle?.vin || ''"
    @close="store.closeDrawer"
  >
    <div v-if="store.selectedVehicle" class="drawer-module-wrapper">
      <BusinessCardInfo
        :dealer="store.selectedVehicle.dealer"
        @update:card="updateBusinessCardUrl"
      />

      <VinStatusCheck :vehicle="store.selectedVehicle" />

      <FinancialValidation :vehicle="store.selectedVehicle" />

      <VatAndAccountingControl :vehicle="store.selectedVehicle" :margin="unbalanceMargin" />
    </div>
  </GlobalDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExportStore } from '@/features/export-management/store/useExportStore'

// 하위 컴포넌트 임포트
import GlobalDrawer from '@/global-ui/GlobalDrawer.vue'
import BusinessCardInfo from '@/global-comonents/BusinessCardInfo.vue'
import VinStatusCheck from '@/global-comonents/VinStatusCheck.vue'
import FinancialValidation from '@/global-comonents/FinancialValidation.vue'
import VatAndAccountingControl from '@/global-comonents/VatAndAccountingControl.vue'

const store = useExportStore()

// 역마진 계산 (VatAndAccountingControl에 prop으로 전달하기 위함)
const unbalanceMargin = computed(() => {
  if (!store.selectedVehicle) return 0
  return store.selectedVehicle.expectedSalesPrice - store.selectedVehicle.purchasePrice
})

// 명함 업로드 이벤트 처리
const updateBusinessCardUrl = (newUrl: string) => {
  const currentDealerId = store.selectedVehicle?.dealer?.id

  if (currentDealerId) {
    // 스토어에 있는 업로드 로직
    store.updateDealerBusinessCard(currentDealerId, newUrl)
  }
}
</script>

<style scoped>
/* 공통 UI 및 레이아웃을 위한 기본 스타일 모음 (전역 파일에 두어도 무방합니다) */
.drawer-module-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

:deep(.section-title) {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.section-title.text-danger) {
  color: var(--color-danger);
}
:deep(.info-card) {
  padding: 1.25rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-white);
}
:deep(.bg-danger-light) {
  background: var(--color-danger-bg);
  border-color: #fecaca;
}
:deep(.flex-between) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.mt-1) {
  margin-top: 0.5rem;
}
:deep(.mt-2) {
  margin-top: 1rem;
}
:deep(.status-badge) {
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}
:deep(.badge-green) {
  background: var(--color-success-bg);
  color: var(--color-success);
}
:deep(.badge-red) {
  background: var(--color-danger);
  color: white;
}
:deep(.badge-gray) {
  background: var(--border-light);
  color: var(--text-sub);
}
:deep(.price-row) {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}
:deep(.price-row .label) {
  color: var(--text-sub);
}
:deep(.price-row .val) {
  font-weight: 500;
}
:deep(.price-row.total) {
  font-weight: 700;
  font-size: 1rem;
}
:deep(.divider) {
  border: none;
  border-top: 1px dashed var(--border-light);
  margin: 0.5rem 0;
}
:deep(.warning-text) {
  font-size: 0.8rem;
  color: var(--color-danger);
  margin: 0.75rem 0 0 0;
  line-height: 1.4;
  font-weight: 500;
}
:deep(.text-red) {
  color: var(--color-danger);
}
:deep(.text-green) {
  color: var(--color-success);
}
:deep(.btn-sm) {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: 1px solid var(--border-hover);
  border-radius: 4px;
  background: var(--bg-body);
  cursor: pointer;
}
:deep(.btn-sm:hover:not(:disabled)) {
  background: var(--border-light);
}
:deep(.action-box) {
  background: var(--bg-body);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 1.25rem;
}
:deep(.vat-info) {
  background: var(--bg-white);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
:deep(.action-desc) {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin: 0 0 1rem 0;
  line-height: 1.4;
}
:deep(.btn-danger) {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: var(--color-danger);
  color: white;
  font-weight: 700;
  cursor: pointer;
}
:deep(.btn-danger:hover:not(:disabled)) {
  background: #dc2626;
}
</style>
