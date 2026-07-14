<template>
  <section class="page-container">
    <header class="page-header">
      <h1 class="page-title">🤝 딜러 및 매입처 관리</h1>
      <p class="page-desc">등록된 명함과 매입처별 차량 내역을 관리합니다.</p>
    </header>

    <div class="dealer-grid">
      <div
        v-for="dealer in uniqueDealers"
        :key="dealer.id"
        class="dealer-card"
        @click="openDealerDetails(dealer)"
      >
        <div class="card-image-wrapper">
          <img
            v-if="dealer.businessCardUrl"
            :src="dealer.businessCardUrl"
            alt="명함"
            class="business-card-img"
          />
          <div v-else class="empty-card">
            <span class="icon">📇</span>
            <span>명함 미등록</span>
          </div>
        </div>
        <div class="card-body">
          <div class="company-name">{{ dealer.company }}</div>
          <div class="dealer-name">{{ dealer.name }} 딜러</div>
          <div class="dealer-phone">{{ dealer.phone }}</div>
        </div>
        <div class="card-footer">
          <div class="stat">
            매입 차량 <span class="highlight">{{ dealer.vehicleCount }}</span
            >대
          </div>
          <span class="arrow-btn">내역 보기 ➔</span>
        </div>
      </div>
    </div>

    <GlobalDrawer
      :is-open="isDrawerOpen"
      :title="selectedDealer?.company || '상세 정보'"
      :subtitle="selectedDealer ? `${selectedDealer.name} | ${selectedDealer.phone}` : ''"
      @close="closeDrawer"
    >
      <template v-if="selectedDealer">
        <BusinessCardInfo :dealer="selectedDealer" @update:card="updateBusinessCard" />

        <section class="info-section">
          <h3 class="section-title">🚗 매입 차량 목록 (총 {{ targetVehicles.length }}대)</h3>

          <div class="vehicle-list">
            <div v-for="v in targetVehicles" :key="v.id" class="vehicle-item">
              <div class="v-header">
                <strong>{{ v.model }}</strong>
                <span
                  class="status-badge"
                  :class="v.shipmentStatus === '선적 완료' ? 'bg-green' : 'bg-orange'"
                >
                  {{ v.shipmentStatus }}
                </span>
              </div>
              <div class="v-body">
                <span class="v-vin">{{ v.vin }}</span>
                <span class="v-price">매입가: {{ v.purchasePrice.toLocaleString() }}만원</span>
              </div>
            </div>
          </div>
        </section>
      </template>
    </GlobalDrawer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GlobalDrawer from '@/global-ui/GlobalDrawer.vue'
import BusinessCardInfo from '@/global-comonents/BusinessCardInfo.vue'
import { useExportStore } from '@/features/export-management/store/useExportStore'
import type { Dealer, Vehicle } from '@/features/export-management/types/export.types'

const store = useExportStore()

// 상태 관리 (글로벌 모달 제어용)
const isDrawerOpen = ref(false)
const selectedDealer = ref<(Dealer & { vehicleCount: number }) | null>(null)

// 1. 고유 딜러 목록 추출
const uniqueDealers = computed(() => {
  const dealerMap = new Map<string, Dealer & { vehicleCount: number }>()
  const allVehicles = store.vehicles || []

  allVehicles.forEach((v: Vehicle) => {
    if (!v.dealer) return
    if (!dealerMap.has(v.dealer.id)) {
      dealerMap.set(v.dealer.id, { ...v.dealer, vehicleCount: 0 })
    }
    const dealerInfo = dealerMap.get(v.dealer.id)!
    dealerInfo.vehicleCount += 1
  })

  return Array.from(dealerMap.values())
})

// 2. 선택된 딜러가 매입한 차량 목록
const targetVehicles = computed(() => {
  if (!selectedDealer.value) return []
  return (store.vehicles || []).filter((v: Vehicle) => v.dealer?.id === selectedDealer.value!.id)
})

// 서랍장 열기/닫기
const openDealerDetails = (dealer: Dealer & { vehicleCount: number }) => {
  selectedDealer.value = dealer
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  selectedDealer.value = null
}

// 3. 스토어 전역 동기화가 적용된 업로드 핸들러
const updateBusinessCard = (newUrl: string) => {
  if (selectedDealer.value) {
    // 1. 현재 모달과 배경의 딜러 카드에 즉각 반영하기 위해 로컬 상태 업데이트
    // (uniqueDealers에서 복사된 객체이므로 직접 갱신 필요)
    selectedDealer.value.businessCardUrl = newUrl

    // 2. 스토어 내부의 전체 차량 리스트(Vehicle) 동기화 액션 호출
    store.updateDealerBusinessCard(selectedDealer.value.id, newUrl)
  }
}
</script>

<style scoped>
/* 페이지 기본 레이아웃 */
.page-container {
  padding: 2rem 2.5rem;
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.page-desc {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* 딜러 카드 그리드 */
.dealer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.dealer-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.dealer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  border-color: #2563eb;
}

/* 명함 이미지 영역 */
.card-image-wrapper {
  height: 160px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.business-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94a3b8;
  font-size: 0.85rem;
}

.empty-card .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

/* 카드 본문 */
.card-body {
  padding: 1.25rem;
  flex: 1;
}

.company-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.dealer-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.25rem;
}

.dealer-phone {
  font-size: 0.85rem;
  color: #64748b;
  font-family: monospace;
}

/* 카드 푸터 */
.card-footer {
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.card-footer .stat {
  color: #64748b;
}

.card-footer .highlight {
  color: #2563eb;
  font-weight: 700;
  font-size: 1rem;
}

.arrow-btn {
  color: #2563eb;
  font-weight: 600;
}

/* 차량 목록 스타일 */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f1f5f9;
}
.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.vehicle-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  transition: border-color 0.2s;
}
.vehicle-item:hover {
  border-color: #2563eb;
}
.v-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
.v-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
}
.v-vin {
  font-family: monospace;
}
.v-price {
  font-weight: 500;
  color: #1e293b;
}

.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}
.bg-green {
  background: #16a34a;
}
.bg-orange {
  background: #f59e0b;
}
</style>
