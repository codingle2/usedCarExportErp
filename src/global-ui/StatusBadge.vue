<template>
  <span class="status-pill" :class="[variantClass, typeClass]">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'green' | 'red' | 'orange' | 'yellow' | 'gray'
  type?: 'solid' | 'outline'
}>()

const variantClass = computed(() => `color-${props.variant || 'gray'}`)
const typeClass = computed(() => `type-${props.type || 'solid'}`)
</script>

<style scoped>
.status-pill {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Solid Types */
.type-solid.color-green {
  background: var(--color-success-bg);
  color: var(--color-success);
}
.type-solid.color-red {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.type-solid.color-orange {
  background: var(--color-orange-bg);
  color: #f97316;
}
.type-solid.color-yellow {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

/* Outline Types */
.type-outline {
  background: transparent;
}
.type-outline.color-green {
  border: 1px solid var(--color-success);
  color: var(--color-success);
}
.type-outline.color-orange {
  border: 1px solid var(--color-orange);
  color: var(--color-orange);
}
.type-outline.color-yellow {
  border: 1px solid var(--color-warning);
  color: var(--color-warning);
}
.type-outline.color-gray {
  border: 1px solid var(--border-hover);
  color: var(--text-sub);
}
</style>
