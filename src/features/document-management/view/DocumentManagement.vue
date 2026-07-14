<template>
  <section class="page-container">
    <header class="page-header">
      <div class="header-title-group">
        <h1 class="page-title">📑 증빙 및 부가세 관리</h1>
        <p class="page-desc">홈택스 연동 증빙 처리 및 수출 기한에 따른 부가세 위험을 방어합니다.</p>
      </div>

      <div class="hometax-status" :class="{ 'is-connected': isHometaxConnected }">
        <span class="status-dot"></span>
        <span class="status-text">
          홈택스 API {{ isHometaxConnected ? '연동 중' : '연결 끊김' }}
        </span>
      </div>
    </header>

    <div class="summary-dashboard">
      <div class="summary-card">
        <div class="card-title">미발행 현금영수증</div>
        <div class="card-value text-orange">
          {{ pendingReceipts.length }}<span class="unit">건</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="card-title">이번 달 부가세 방어액 (예상)</div>
        <div class="card-value text-green">14,250<span class="unit">만원</span></div>
      </div>
      <div class="summary-card danger-card">
        <div class="card-title">🚨 수출 기한 임박 (D-7 이내)</div>
        <div class="card-value text-red">
          {{ urgentVatRisks.length }}<span class="unit">대</span>
        </div>
      </div>
    </div>

    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'receipt' }"
        @click="activeTab = 'receipt'"
      >
        🧾 현금영수증 발행 (홈택스)
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'vat' }" @click="activeTab = 'vat'">
        🛡️ 부가세 손실 방어
      </button>
    </div>

    <div v-if="activeTab === 'receipt'" class="tab-content">
      <div class="content-toolbar">
        <h3 class="section-title">발행 대기 목록</h3>
        <button class="btn-primary" @click="handleBatchIssue" :disabled="!pendingReceipts.length">
          <span class="icon">⚡</span> 일괄 자동발행
        </button>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th width="40"><input type="checkbox" /></th>
              <th>매입 일자</th>
              <th>차량 정보</th>
              <th>매입처 (딜러)</th>
              <th class="text-right">매입 금액</th>
              <th class="text-center">상태</th>
              <th class="text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pendingReceipts.length === 0">
              <td colspan="7" class="text-center text-sub py-4">
                발행 대기 중인 영수증이 없습니다.
              </td>
            </tr>
            <tr
              v-for="vehicle in pendingReceipts"
              :key="vehicle.id"
              @click="store.openDrawer(vehicle)"
              class="clickable-row"
            >
              <td><input type="checkbox" @click.stop /></td>
              <td class="tabular-nums">{{ vehicle.purchaseDate }}</td>
              <td>
                <strong>{{ vehicle.model }}</strong>
                <span class="text-sub">({{ vehicle.vin }})</span>
              </td>
              <td>{{ vehicle.dealer.company }} ({{ vehicle.dealer.name }})</td>
              <td class="text-right tabular-nums">
                {{ vehicle.purchasePrice.toLocaleString() }}만원
              </td>
              <td class="text-center">
                <span class="status-badge bg-orange">{{ vehicle.receiptStatus }}</span>
              </td>
              <td class="text-center">
                <button class="btn-outline-sm" @click.stop="issueSingleReceipt(vehicle.id)">
                  즉시 발행
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'vat'" class="tab-content">
      <div class="content-toolbar">
        <h3 class="section-title">수출 말소 기한 모니터링</h3>
        <div class="filter-group">
          <select class="select-sm">
            <option>위험도 높은 순</option>
            <option>기한 임박 순</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>선적 상태</th>
              <th>차량 정보</th>
              <th>수출 이행 기한</th>
              <th>남은 기간</th>
              <th class="text-right">예상 환급/손실액</th>
              <th class="text-center">리스크 관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="urgentVatRisks.length === 0">
              <td colspan="6" class="text-center text-sub py-4">
                기한이 임박한 위험 차량이 없습니다.
              </td>
            </tr>
            <tr
              v-for="risk in urgentVatRisks"
              :key="risk.id"
              @click="store.openDrawer(risk)"
              class="clickable-row"
              :class="{ 'row-danger': getDaysLeft(risk.exportDeadline) <= 3 }"
            >
              <td>
                <span
                  class="status-badge"
                  :class="risk.shipmentStatus === '선적 보류' ? 'bg-red' : 'bg-blue'"
                >
                  {{ risk.shipmentStatus }}
                </span>
              </td>
              <td>
                <strong>{{ risk.model }}</strong> <span class="text-sub">({{ risk.vin }})</span>
              </td>
              <td class="tabular-nums">{{ risk.exportDeadline }}</td>
              <td>
                <span
                  class="time-left"
                  :class="
                    getDaysLeft(risk.exportDeadline) <= 3 ? 'text-red font-bold' : 'text-orange'
                  "
                >
                  D{{
                    getDaysLeft(risk.exportDeadline) >= 0
                      ? `-${getDaysLeft(risk.exportDeadline)}`
                      : `+${Math.abs(getDaysLeft(risk.exportDeadline))} (초과)`
                  }}
                </span>
              </td>
              <td class="text-right tabular-nums">
                <span class="text-red font-bold">-${{ risk.vatRisk.toLocaleString() }}</span>
              </td>
              <td class="text-center">
                <button
                  class="btn-danger-sm"
                  @click.stop="urgeShipment(risk.id)"
                  :disabled="risk.shipmentStatus === '선적 보류'"
                >
                  {{ risk.shipmentStatus === '선적 보류' ? '보류됨' : '선적 보류' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <VehicleDetailDrawer />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExportStore } from '@/features/export-management/store/useExportStore'
import VehicleDetailDrawer from '@/features/export-management/components/VehicleDetailDrawer.vue'

const store = useExportStore()

const activeTab = ref('receipt')
const isHometaxConnected = ref(true)

const pendingReceipts = computed(() => {
  return store.vehicles.filter((v) => v.receiptStatus === '발행 대기')
})

const getDaysLeft = (deadline: string) => {
  const today = new Date('2026-07-15')
  const targetDate = new Date(deadline)
  const diffTime = targetDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Store 원본 객체의 Reference(반응성)를 잃지 않기 위해 객체를 새로 매핑하지 않고 원본 그대로 filter 처리
const urgentVatRisks = computed(() => {
  return store.vehicles
    .filter(
      (v) =>
        v.shipmentStatus !== '선적 완료' && (getDaysLeft(v.exportDeadline) <= 14 || v.vatRisk > 0),
    )
    .sort((a, b) => getDaysLeft(a.exportDeadline) - getDaysLeft(b.exportDeadline))
})

const handleBatchIssue = async () => {
  if (!confirm(`대기 중인 현금영수증을 홈택스를 통해 일괄 발행하시겠습니까?`)) return
  await new Promise((resolve) => setTimeout(resolve, 800))
  store.vehicles.forEach((v) => {
    if (v.receiptStatus === '발행 대기') v.receiptStatus = '발행 완료'
  })
  alert('성공적으로 일괄 발행되었습니다.')
}

const issueSingleReceipt = (id: string) => {
  const vehicle = store.vehicles.find((v) => v.id === id)
  if (vehicle) {
    vehicle.receiptStatus = '발행 완료'
    alert(`${vehicle.model} 건의 현금영수증이 즉시 발행되었습니다.`)
  }
}

const urgeShipment = (id: string) => {
  if (!confirm('직권으로 선적을 보류하시겠습니까?')) return

  try {
    store.enforceShipmentHold(id)
  } catch (error) {
    console.error('Shipment hold failed:', error)
    alert('상태 변경에 실패했습니다.')
  }
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

/* 헤더 및 홈택스 인디케이터 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
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

.hometax-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}
.hometax-status.is-connected {
  color: #16a34a;
  border-color: #bbf7d0;
  background: #f0fdf4;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.is-connected .status-dot {
  box-shadow: 0 0 8px #16a34a;
}

/* 요약 대시보드 */
.summary-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.summary-card.danger-card {
  border-color: #fecaca;
  background: #fff5f5;
}
.card-title {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: monospace;
}
.card-value .unit {
  font-size: 1rem;
  font-weight: 500;
  margin-left: 0.25rem;
}

/* 탭 내비게이션 */
.tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}
.tab-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}
.tab-btn:hover {
  color: #1e293b;
}
.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

/* 탭 컨텐츠 툴바 */
.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* 고밀도 데이터 테이블 */
.table-wrapper {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.data-table th,
.data-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-align: left;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.clickable-row:hover {
  background: #f1f5f9 !important;
}

.data-table tbody tr.row-danger {
  background: #fff5f5;
}
.data-table tbody tr.row-danger:hover {
  background: #fee2e2 !important;
}

/* 유틸리티 및 텍스트 스타일 */
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.text-sub {
  color: #64748b;
}
.text-right {
  text-align: right;
}
.text-center {
  text-align: center;
}
.text-orange {
  color: #f59e0b;
}
.text-green {
  color: #16a34a;
}
.text-red {
  color: #dc2626;
}
.font-bold {
  font-weight: 700;
}
.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-family: monospace;
}

/* 뱃지 */
.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  display: inline-block;
}
.bg-orange {
  background: #f59e0b;
}
.bg-blue {
  background: #3b82f6;
}
.bg-red {
  background: #dc2626;
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
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}
.btn-primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
.btn-outline-sm {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #334155;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-outline-sm:hover:not(:disabled) {
  background: #f8fafc;
}
.btn-danger-sm {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-danger-sm:hover:not(:disabled) {
  background: #b91c1c;
}
.btn-danger-sm:disabled {
  background: #fca5a5;
  cursor: not-allowed;
}
.select-sm {
  padding: 0.3rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  outline: none;
}
</style>
