//재무 타당성 검증
<template>
  <section class="risk-section">
    <h3 class="section-title">📊 재무 타당성 (언밸런스 검증)</h3>
    <div class="info-card">
      <div class="price-row">
        <span class="label">매입가</span>
        <span class="val">{{ vehicle.purchasePrice.toLocaleString() }} 만원</span>
      </div>
      <div class="price-row">
        <span class="label">예상 매출가 (FOB)</span>
        <span class="val">{{ vehicle.expectedSalesPrice.toLocaleString() }} 만원</span>
      </div>
      <hr class="divider" />
      <div class="price-row total" :class="margin < 0 ? 'text-red' : 'text-green'">
        <span class="label">예상 마진</span>
        <span class="val">{{ margin > 0 ? '+' : '' }}{{ margin.toLocaleString() }} 만원</span>
      </div>
      <p v-if="margin < 0" class="warning-text mt-2">
        🚨 매입가가 매출가보다 높습니다. 회계팀의 특별 승인이 필요합니다!
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Vehicle } from '@/features/export-management/types/export.types'

const props = defineProps<{ vehicle: Vehicle }>()
const margin = computed(() => props.vehicle.expectedSalesPrice - props.vehicle.purchasePrice)
</script>
