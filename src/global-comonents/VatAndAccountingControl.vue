<template>
  <section class="risk-section">
    <h3 class="section-title text-danger">🛡️ 부가세 방어 및 회계 통제</h3>
    <div class="action-box">
      <div class="vat-info">
        <div class="flex-between">
          <span>수출 이행 기한</span>
          <strong>{{ vehicle.exportDeadline }}</strong>
        </div>
        <div class="flex-between mt-1">
          <span>예상 부가세 환급/손실액</span>
          <strong class="text-red">
            {{ vehicle.vatRisk > 0 ? `-$${vehicle.vatRisk}` : 'Safe' }}
          </strong>
        </div>
      </div>

      <p class="action-desc">
        기한 내 선적 및 말소가 이뤄지지 않거나 역마진 등 위험 신호가 확인되면, 담당자 승인과
        무관하게 선적을 직접 보류시킵니다.
      </p>

      <template v-if="authStore.isAccountManager">
        <button
          v-if="vehicle.shipmentStatus !== '선적 보류'"
          class="btn-danger"
          @click="holdShipment"
        >
          🚨 회계팀장 직권 선적 보류
        </button>

        <button v-else class="btn-outline-success" @click="releaseShipment">
          ✅ 선적 보류 해제
        </button>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/auth/store/useAuthStore'
import { useExportStore } from '@/features/export-management/store/useExportStore'
import { useNotificationStore } from '@/features/export-management/store/useNotificationStore'
import { NOTI_CODES, BusinessNotificationEvent } from '@/constants/notification.constants'
import type { Vehicle } from '@/features/export-management/types/export.types'

const props = defineProps<{ vehicle: Vehicle; margin: number }>()
const authStore = useAuthStore()
const store = useExportStore()
const notiStore = useNotificationStore()

// 보류 액션
const holdShipment = () => {
  if (props.margin < 0) {
    if (!confirm('역마진이 발생한 차량입니다. 정말 보류하시겠습니까?')) return
  }

  try {
    store.enforceShipmentHold(props.vehicle.id)
    notiStore.captureNotification(
      new BusinessNotificationEvent(NOTI_CODES.SHIPMENT_FORCE_HELD, {
        model: props.vehicle.model,
        vin: props.vehicle.vin,
      }),
    )
  } catch (error) {
    console.error(error)
    alert('시스템 오류가 발생했습니다.')
  }
}

// 보류 해제 액션
const releaseShipment = () => {
  if (!confirm('리스크가 해소되었습니까? 선적 보류를 해제합니다.')) return

  try {
    // 이전에 다중 선택 처리를 위해 스토어에 만든 함수에 단일 ID를 배열로 씌워 전달합니다.
    store.batchReleaseShipment([props.vehicle.id])

    // (선택사항) 해제 알림을 추가할 수도 있습니다.
    alert('선적 보류가 해제되어 다시 조건부 선적 상태로 전환되었습니다.')
  } catch (error) {
    console.error(error)
    alert('상태 변경 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
/* 기존 부모에서 상속받는 스타일은 유지하고(deep), 새로 추가된 해제 버튼 스타일만 정의합니다. */
.btn-outline-success {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #22c55e;
  border-radius: 6px;
  background: white;
  color: #16a34a;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline-success:hover {
  background: #f0fdf4;
}
</style>
