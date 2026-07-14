<template>
  <section class="risk-section">
    <h3 class="section-title">
      📇 매입처 정보 (명함 OCR)
      <label class="btn-sm file-upload-label">
        이미지 교체
        <input type="file" accept="image/*" @change="handleUpload" hidden />
      </label>
    </h3>
    <div class="info-card">
      <div class="business-card-preview">
        <img
          v-if="dealer?.businessCardUrl"
          :src="dealer.businessCardUrl"
          alt="명함 이미지"
          class="card-img"
        />
        <div v-else class="empty-card">
          <span>등록된 명함이 없습니다.</span>
        </div>
      </div>

      <hr class="divider" />

      <div class="price-row">
        <span class="label">상사명</span>
        <span class="val">{{ dealer?.company }}</span>
      </div>
      <div class="price-row">
        <span class="label">담당 딜러</span>
        <span class="val">{{ dealer?.name }}</span>
      </div>
      <div class="price-row">
        <span class="label">연락처</span>
        <span class="val">{{ dealer?.phone }}</span>
      </div>

      <p class="warning-text mt-2">
        * 명함을 교체하면 OCR이 새롭게 데이터를 추출하여 DB에 저장됩니다.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Dealer } from '@/features/export-management/types/export.types'

defineProps<{
  dealer?: Dealer | null
}>()
const emit = defineEmits<{
  (e: 'update:card', newUrl: string): void
}>()

const handleUpload = (event: Event) => {
  const target = event.target as HTMLInputElement

  const file = target.files?.[0]

  if (file) {
    const tempImageUrl = URL.createObjectURL(file)
    emit('update:card', tempImageUrl)
  }
}
</script>

<style scoped>
/* 1. 레이아웃 및 타이틀 */
.risk-section {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 2. 파일 업로드 버튼 */
.btn-sm {
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  color: #334155;
  transition: background 0.2s;
}
.btn-sm:hover {
  background: #f8fafc;
}
.file-upload-label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

/* 3. 명함 박스 및 이미지 미리보기 */
.info-card {
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}
.business-card-preview {
  width: 100%;
  height: 180px;
  background: #f8fafc;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.empty-card {
  color: #94a3b8;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.empty-card::before {
  content: '📷';
  font-size: 2rem;
  opacity: 0.5;
}

/* 4. 텍스트 정보 레이아웃 */
.price-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}
.price-row .label {
  color: #64748b;
}
.price-row .val {
  font-weight: 600;
  color: #1e293b;
}
.divider {
  border: none;
  border-top: 1px dashed #e5e7eb;
  margin: 0.5rem 0;
}
.warning-text {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 1rem;
  line-height: 1.4;
}
</style>
