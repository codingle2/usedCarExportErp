import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vehicle, ExportFilters, PipelineTab } from '../types/export.types'
import { MOCK_VEHICLES, EXPORT_TABS } from '@/constants/export.constants'
import { SYS_ERROR_CODES, SystemError } from '@/constants/error.constants'

export const useExportStore = defineStore('exportManagement', () => {
  const vehicles = ref<Vehicle[]>([...MOCK_VEHICLES])

  const defaultFilters: ExportFilters = {
    tab: EXPORT_TABS.ALL as PipelineTab,
    query: '',
    docStatus: '전체 상태',
    riskStatus: 'all',
  }
  const filters = ref<ExportFilters>({ ...defaultFilters })
  const currentPage = ref(1)
  const itemsPerPage = 10

  const isDrawerOpen = ref(false)
  const selectedVehicle = ref<Vehicle | null>(null)

  let drawerClearTimeoutId: ReturnType<typeof setTimeout> | null = null

  // 수출 기한 남은 일수 계산 유틸리티
  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date('2026-07-15').getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  // [핵심 로직] 차량이 현재 어느 파이프라인 관문에 막혀있는지 판별
  const getVehicleCategory = (v: Vehicle): PipelineTab => {
    // 1순위: 회계팀장이 직권으로 보류한 차량
    if (v.shipmentStatus === '선적 보류') return EXPORT_TABS.PENDING_APPROVAL

    // 2순위: 법적/세무 리스크 (압류, 부가세 손실액 발생, 기한 7일 이내 임박)
    if (v.vinStatus !== '정상' || v.vatRisk > 0 || getDaysLeft(v.exportDeadline) <= 7) {
      return EXPORT_TABS.RISK_WARNING
    }

    // 3순위: 증빙/재무 미흡 (영수증 미발행, 역마진)
    if (v.receiptStatus === '발행 대기' || v.expectedSalesPrice - v.purchasePrice < 0) {
      return EXPORT_TABS.MISSING_DOCS
    }

    // 위 허들을 모두 무사히 통과했다면 선적 가능 상태
    return EXPORT_TABS.READY_TO_SHIP
  }

  const filteredVehicles = computed(() => {
    return vehicles.value.filter((v) => {
      // 탭 필터 적용 (파이프라인 관문 기준)
      const matchTab =
        filters.value.tab === EXPORT_TABS.ALL || getVehicleCategory(v) === filters.value.tab

      const searchLower = filters.value.query.toLowerCase()
      const matchSearch =
        !filters.value.query ||
        v.model.toLowerCase().includes(searchLower) ||
        v.vin.toLowerCase().includes(searchLower) ||
        v.buyerName.toLowerCase().includes(searchLower) ||
        v.dealer.company.toLowerCase().includes(searchLower)

      const matchDocStatus =
        filters.value.docStatus === '전체 상태' || v.docStatus === filters.value.docStatus

      const matchRiskStatus =
        filters.value.riskStatus === 'all'
          ? true
          : filters.value.riskStatus === 'safe'
            ? v.vatRisk === 0
            : v.vatRisk > 0

      return matchTab && matchSearch && matchDocStatus && matchRiskStatus
    })
  })
  const paginatedVehicles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredVehicles.value.slice(start, start + itemsPerPage)
  })

  const totalPages = computed(() => Math.ceil(filteredVehicles.value.length / itemsPerPage) || 1)

  const getCount = computed(() => (status: PipelineTab) => {
    if (status === EXPORT_TABS.ALL) return vehicles.value.length

    // 이전 로직: v.shipmentStatus === status (삭제)
    // 변경 로직: 차량을 분류기에 넣고 그 결과가 탭 이름과 같은지 확인
    return vehicles.value.filter((v) => getVehicleCategory(v) === status).length
  })

  const setTab = (tab: PipelineTab) => {
    filters.value.tab = tab
    currentPage.value = 1
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
  }

  const openDrawer = (v: Vehicle) => {
    if (drawerClearTimeoutId) clearTimeout(drawerClearTimeoutId)
    selectedVehicle.value = v
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
    drawerClearTimeoutId = setTimeout(() => {
      selectedVehicle.value = null
    }, 300)
  }

  const enforceShipmentHold = (vehicleId: string) => {
    const vehicle = vehicles.value.find((v) => v.id === vehicleId)

    if (!vehicle) throw new SystemError(SYS_ERROR_CODES.DATA_NOT_FOUND)

    if (vehicle.shipmentStatus === '선적 보류') {
      throw new SystemError(SYS_ERROR_CODES.STATE_TRANSITION_DENIED)
    }

    vehicle.shipmentStatus = '선적 보류'
    if (selectedVehicle.value?.id === vehicleId) {
      selectedVehicle.value.shipmentStatus = '선적 보류'
    }
  }

  // 회계팀장용: 다중 선택 일괄 선적 보류
  const batchHoldShipment = (vehicleIds: string[]) => {
    vehicles.value.forEach((v) => {
      if (vehicleIds.includes(v.id) && v.shipmentStatus !== '선적 완료') {
        v.shipmentStatus = '선적 보류'
      }
    })
  }

  // 회계팀장용: 다중 선택 일괄 보류 해제
  const batchReleaseShipment = (vehicleIds: string[]) => {
    vehicles.value.forEach((v) => {
      if (vehicleIds.includes(v.id) && v.shipmentStatus === '선적 보류') {
        v.shipmentStatus = '조건부 선적' // 해제 시 기본 상태로 롤백
      }
    })
  }
  const fetchRealtimeVinStatus = (vin: string): string => {
    const vehicle = vehicles.value.find((v) => v.vin === vin)
    if (!vehicle) return '정상'

    // 상세창 동기화
    if (selectedVehicle.value?.vin === vin) {
      selectedVehicle.value.vinStatus = vehicle.vinStatus
    }

    // 변경된 상태값을 그대로 반환
    return vehicle.vinStatus
  }

  const updateDealerBusinessCard = (dealerId: string, newUrl: string) => {
    vehicles.value.forEach((v) => {
      if (v.dealer?.id === dealerId) {
        v.dealer.businessCardUrl = newUrl
      }
    })

    if (selectedVehicle.value?.dealer?.id === dealerId) {
      selectedVehicle.value.dealer.businessCardUrl = newUrl
    }
  }

  const resetFilters = () => {
    filters.value = { ...defaultFilters }
    currentPage.value = 1
  }

  return {
    vehicles,
    filters,
    currentPage,
    totalPages,
    paginatedVehicles,
    isDrawerOpen,
    selectedVehicle,
    getCount,
    setTab,
    setPage,
    openDrawer,
    closeDrawer,
    enforceShipmentHold,
    getVehicleCategory,
    batchHoldShipment, // 일괄 보류 Action 노출
    batchReleaseShipment, //일괄 해제 Action 노출
    resetFilters,
    fetchRealtimeVinStatus,
    updateDealerBusinessCard,
  }
})
