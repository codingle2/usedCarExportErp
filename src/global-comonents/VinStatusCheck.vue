//VIN 상태 조회
<template>
  <section class="risk-section">
    <h3 class="section-title">
      🔍 VIN 상태 조회
      <button class="btn-sm" @click="checkVin" :disabled="isChecking">
        {{ isChecking ? '조회 중...' : '실시간 조회' }}
      </button>
    </h3>
    <div class="info-card" :class="{ 'bg-danger-light': vehicle.vinStatus !== '정상' }">
      <div class="flex-between">
        <span class="label">차량 원부 상태</span>
        <span class="status-badge" :class="badgeClass">{{ vehicle.vinStatus }}</span>
      </div>
      <p v-if="vehicle.vinStatus !== '정상'" class="warning-text mt-1">
        ⚠️ 선적 전 압류/저당 해지가 완료되어야 수출 말소가 가능합니다.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExportStore } from '@/features/export-management/store/useExportStore'
import { useNotificationStore } from '@/features/export-management/store/useNotificationStore'
import { NOTI_CODES, BusinessNotificationEvent } from '@/constants/notification.constants'
import type { Vehicle } from '@/features/export-management/types/export.types'

const props = defineProps<{ vehicle: Vehicle }>()
const store = useExportStore()
const notiStore = useNotificationStore()

const isChecking = ref(false)

const badgeClass = computed(() => {
  switch (props.vehicle.vinStatus) {
    case '정상':
      return 'badge-green'
    case '도난 의심':
    case '압류 상태':
      return 'badge-red'
    default:
      return 'badge-gray'
  }
})

const checkVin = () => {
  isChecking.value = true

  setTimeout(() => {
    // 1. 상태를 변경하고 그 결과값을 받음
    const newStatus = store.fetchRealtimeVinStatus(props.vehicle.vin)

    // 2. [핵심] 여기서 '정상'이 아닐 때만 알림을 띄우는 것이 맞는지 확인
    if (newStatus !== '정상') {
      console.log('상태가 비정상이므로 알림 발생:', newStatus)
      const context = { model: props.vehicle.model, vin: props.vehicle.vin }
      notiStore.captureNotification(
        new BusinessNotificationEvent(NOTI_CODES.VIN_SEIZED_OR_STOLEN, context),
      )
    } else {
      console.log('정상 상태이므로 알림 생략')
    }

    isChecking.value = false
  }, 500)
}
</script>
