<template>
  <ExportPipeline />
  <VehicleTable>
    <template #filters>
      <VehicleFilters />
    </template>
  </VehicleTable>

  <VehicleDetailDrawer />
</template>

<script setup lang="ts">
import ExportPipeline from '@/features/export-management/components/ExportPipeline.vue'
import VehicleFilters from '@/features/export-management/components/VehicleFilters.vue'
import VehicleTable from '@/features/export-management/components/VehicleTable.vue'
import VehicleDetailDrawer from '@/features/export-management/components/VehicleDetailDrawer.vue'
</script>
