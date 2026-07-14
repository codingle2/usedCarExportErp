<template>
  <section class="list-section">
    <slot name="filters"></slot>

    <div class="batch-action-bar" v-if="selectedIds.length > 0">
      <span class="selected-count"
        ><strong>{{ selectedIds.length }}</strong
        >대 선택됨</span
      >
      <div class="action-buttons" v-if="authStore.isAccountManager">
        <button class="btn-danger" @click="handleBatchHold">🚨 일괄 선적 보류</button>
        <button class="btn-outline" @click="handleBatchRelease">✅ 보류 일괄 해제</button>
      </div>
      <div v-else class="text-sub" style="font-size: 0.85rem">
        ※ 선적 보류 및 해제 권한은 회계팀장에게 있습니다.
      </div>
    </div>

    <div class="table-container">
      <div class="table-body">
        <div class="table-header">
          <div class="th-check">
            <input type="checkbox" :checked="isAllSelected" @change="toggleAll" />
          </div>
          <div class="th-vehicle">차량 정보</div>
          <div class="th-status">진행 상태 (파이프라인)</div>
          <div class="th-finance">재무 / 리스크</div>
        </div>

        <div v-if="store.paginatedVehicles.length === 0" class="empty-state">
          해당 조건의 차량이 없습니다.
        </div>

        <div
          v-for="v in store.paginatedVehicles"
          :key="v.id"
          class="table-row clickable"
          :class="{ 'is-selected': selectedIds.includes(v.id) }"
          @click="store.openDrawer(v)"
        >
          <div class="td-check" @click.stop>
            <input type="checkbox" :value="v.id" v-model="selectedIds" />
          </div>

          <div class="td-vehicle">
            <div class="car-image-placeholder">🚗</div>
            <div class="car-info">
              <div class="car-model">{{ v.model }}</div>
              <div class="car-vin">{{ v.vin }}</div>
            </div>
          </div>

          <div class="td-status">
            <div class="status-col">
              <span class="status-title">현재 관문</span>
              <StatusBadge type="solid" :variant="getPipelineColor(store.getVehicleCategory(v))">
                {{ store.getVehicleCategory(v) }}
              </StatusBadge>
            </div>
            <div class="status-col">
              <span class="status-title">세부 상태</span>
              <StatusBadge type="outline" :variant="getShipmentColor(v.shipmentStatus)">
                {{ v.shipmentStatus }}
              </StatusBadge>
            </div>
          </div>

          <div class="td-finance">
            <div class="finance-col">
              <span class="finance-title">딜러 (매입처)</span>
              <span class="finance-val">{{ v.buyerName }} ({{ v.dealer.company }})</span>
            </div>
            <div class="finance-col right">
              <span class="finance-title">예상 리스크</span>
              <span class="finance-val" :class="v.vatRisk > 0 ? 'text-red' : 'text-green'">
                {{ v.vatRisk > 0 ? `-$${v.vatRisk}` : 'Safe' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExportStore } from '../store/useExportStore'
import { useAuthStore } from '@/auth/store/useAuthStore'
import StatusBadge from '@/global-ui/StatusBadge.vue'
import { EXPORT_TABS } from '@/constants/export.constants'
import type { ShipmentStatus } from '../types/export.types'

const store = useExportStore()
const authStore = useAuthStore()

const selectedIds = ref<string[]>([])

const isAllSelected = computed(() => {
  return (
    store.paginatedVehicles.length > 0 &&
    selectedIds.value.length === store.paginatedVehicles.length
  )
})

const toggleAll = (e: Event) => {
  const isChecked = (e.target as HTMLInputElement).checked
  if (isChecked) {
    selectedIds.value = store.paginatedVehicles.map((v) => v.id)
  } else {
    selectedIds.value = []
  }
}

const handleBatchHold = () => {
  if (!confirm(`${selectedIds.value.length}대의 차량을 직권으로 선적 보류하시겠습니까?`)) return
  store.batchHoldShipment(selectedIds.value)
  selectedIds.value = []
}

const handleBatchRelease = () => {
  if (!confirm(`선택한 차량의 보류 상태를 해제하시겠습니까?`)) return
  store.batchReleaseShipment(selectedIds.value)
  selectedIds.value = []
}
const getPipelineColor = (category: string) => {
  console.log('Current Category:', category)
  console.log('Target Match:', EXPORT_TABS.RISK_WARNING)
  if (category === EXPORT_TABS.MISSING_DOCS) return 'red' // 증빙/재무미흡
  if (category === EXPORT_TABS.RISK_WARNING) return 'orange' // 법적/세무리스크
  if (category === EXPORT_TABS.PENDING_APPROVAL) return 'yellow' // 승인대기
  if (category === EXPORT_TABS.READY_TO_SHIP) return 'green' // 선적가능
  return 'gray'
}

const getShipmentColor = (status: ShipmentStatus) => {
  if (status === '선적 완료') return 'green'
  if (status === '조건부 선적') return 'orange'
  if (status === '선적 보류') return 'red'
  return 'gray'
}
</script>

<style scoped>
/* 1. Layout & Containers */
.list-section {
  padding: 1rem 2.5rem 2rem 2.5rem;
  flex: 1;
}

.table-container {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow-x: auto;
}

/* 2. Batch Action Bar */
.batch-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-white);
  padding: 1rem 1.5rem;
  border: 1px solid var(--border-light);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  margin-bottom: -1px;
}

.selected-count {
  font-size: 0.95rem;
  color: var(--color-primary);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* 3. Table Structure */
.table-header,
.table-row {
  min-width: 900px;
}

.table-header {
  display: flex;
  background: var(--bg-body);
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.table-row {
  display: flex;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--color-primary-light);
  transition: background 0.2s;
}

.table-row:hover {
  background: var(--bg-body);
}

.table-row.is-selected {
  background: var(--color-primary-light);
}

/* 4. Column Sizing */
.th-check,
.td-check {
  width: 3%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.th-vehicle,
.td-vehicle {
  width: 37%;
}
.th-status,
.td-status {
  width: 30%;
}
.th-finance,
.td-finance {
  width: 30%;
}

/* 5. Row Elements & Content */
.td-vehicle {
  height: 54px;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.car-image-placeholder {
  width: 70px;
  height: 45px;
  background: var(--color-primary-light);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.car-model {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.2rem;
}
.car-vin {
  font-size: 0.8rem;
  color: var(--text-sub);
  font-family: monospace;
}

.td-status {
  display: grid;
  grid-template-columns: 100px 120px;
  gap: 1.5rem;
  align-items: center;
}
.status-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
.status-col :deep(.status-pill) {
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

.td-finance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 2rem;
}
.finance-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.finance-col.right {
  align-items: flex-end;
}
.finance-val {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-main);
}

/* 6. Typography & Utilities */
.status-title,
.finance-title {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.text-green {
  color: var(--color-success);
}
.text-red {
  color: var(--color-danger);
}

/* 7. Buttons & Empty State */
.btn-danger {
  background: var(--color-danger);
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.btn-outline {
  background: white;
  border: 1px solid var(--border-hover);
  color: var(--text-main);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}

.empty-state {
  display: flex;
  width: 100%;
  height: 30vh;
  text-align: center;
  align-items: center;
  justify-content: center;
}

/* 8. Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-sub);
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}
.page-btn.active {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}
.page-btn:hover:not(.active) {
  background: var(--color-primary-light);
}
</style>
