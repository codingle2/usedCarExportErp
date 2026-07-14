import type { Vehicle } from '@/features/export-management/types/export.types'

export const EXPORT_TABS = {
  ALL: 'all',
  MISSING_DOCS: '증빙/재무미흡',
  RISK_WARNING: '법적/세무미흡',
  PENDING_APPROVAL: '승인대기',
  READY_TO_SHIP: '선적가능',
} as const

// 딜러 4명
const MOCK_DEALERS = [
  {
    id: 'D001',
    company: '(주)우정상사',
    name: '최딜러',
    phone: '010-1111-2222',
    businessCardUrl: null,
  },
  {
    id: 'D002',
    company: '대한모터스',
    name: '김과장',
    phone: '010-3333-4444',
    businessCardUrl: null,
  },
  {
    id: 'D003',
    company: '글로벌오토',
    name: '박대표',
    phone: '010-5555-6666',
    businessCardUrl: null,
  },
  {
    id: 'D004',
    company: '명품카즈',
    name: '이소장',
    phone: '010-7777-8888',
    businessCardUrl: null,
  },
]

// 차종 및 기준 단가 (단위: 만원)
const MODELS = [
  { name: '그랜저 IG', price: 2800 },
  { name: '팰리세이드', price: 3500 },
  { name: '아반떼 AD', price: 1200 },
  { name: '투싼 NX4', price: 2500 },
  { name: '싼타페 TM', price: 2200 },
]

const BUYERS = ['김매입', '박영업', '최과장']

// 현재 테스트 기준일: 2026-07-15
const TODAY = new Date('2026-07-15').getTime()

// 날짜 생성 헬퍼 (기준일로부터 offset 일수만큼 차이나는 날짜 문자열 반환)
const getDateString = (offsetDays: number) => {
  const d = new Date(TODAY + offsetDays * 24 * 60 * 60 * 1000)
  return d.toISOString().split('T')[0]!
}

// 100대의 차량 더미 데이터
export const MOCK_VEHICLES: Vehicle[] = Array.from({ length: 100 }, (_, i) => {
  const id = `V${String(i + 1).padStart(3, '0')}`
  const vin = `KMH${String(Math.floor(Math.random() * 99999999999999)).padStart(14, '0')}`
  const dealer = MOCK_DEALERS[i % MOCK_DEALERS.length]!
  const buyerName = BUYERS[i % BUYERS.length]!

  const modelObj = MODELS[i % MODELS.length]!
  const model = modelObj.name
  const purchasePrice = modelObj.price

  // 시나리오 분배 (100% 기준)
  const rand = Math.random() * 100

  let docStatus = '완비'
  let shipmentStatus = '조건부 선적'
  let expectedSalesPrice = purchasePrice + 300 // 기본 +300만 원 마진
  let vinStatus = '정상'
  let exportDeadline = getDateString(20) // 20일 후 (안전)
  let vatRisk = 0
  let receiptStatus = '발행 완료'
  const purchaseDate = getDateString(-3)

  // ==========================================
  // 논리적 결함 주입 (시나리오별 분기) -> 너무 이상한데이터 나오면 안되는거 방어로직
  // ==========================================

  if (rand < 35) {
    // 1. [선적 가능 & 완료] (35% 확률) - 결점이 전혀 없는 완벽한 상태
    shipmentStatus = Math.random() > 0.5 ? '선적 완료' : '조회대기' // 대기 중이거나 이미 배에 탄 상태
    // 리스크 없음, 증빙 완비 유지 (위의 기본값들)
  } else if (rand < 60) {
    // 2. [증빙/재무 미흡] (25% 확률) - 현금영수증 안 끊었거나 역마진 발생 (영업팀 과실)
    shipmentStatus = '조건부 선적'

    if (Math.random() > 0.5) {
      receiptStatus = '발행 대기' // 영수증 미발행
      docStatus = '일부 누락'
    } else {
      expectedSalesPrice = purchasePrice - 200 // 역마진 발생 (비싸게 사옴)
    }
    // 단, 법적/세무 리스크는 없어야 이 관문에 머무름
  } else if (rand < 85) {
    // 3. [법적/세무 리스크] (25% 확률) - VIN 문제 있거나 수출 기한 다 되어감
    shipmentStatus = '조건부 선적'

    const riskType = Math.random()
    if (riskType < 0.3) {
      vinStatus = '압류 상태'
    } else if (riskType < 0.4) {
      vinStatus = '도난 의심'
    } else {
      // 수출 이행 기한 임박 (3~5일 남음)
      exportDeadline = getDateString(Math.floor(Math.random() * 3) + 3)
      vatRisk = Math.floor(purchasePrice * 0.1) // 매입가의 10% 정도 부가세 토해낼 위기
    }
  } else {
    // 4. [승인 대기] (15% 확률) - 회계팀장이 너무 위험하다고 판단해 '직권 보류' 때린 차량
    shipmentStatus = '선적 보류'

    // 보류를 때린 타당한 이유(복합적 리스크) 주입
    receiptStatus = '발행 대기'
    expectedSalesPrice = purchasePrice - 150
    if (Math.random() > 0.5) {
      exportDeadline = getDateString(2) // 이틀 남았는데 영수증도 안 끊은 최악의 상황
      vatRisk = Math.floor(purchasePrice * 0.1)
    }
  }

  return {
    id,
    vin,
    model,
    docStatus: docStatus as Vehicle['docStatus'],
    shipmentStatus: shipmentStatus as Vehicle['shipmentStatus'],
    buyerName,
    dealer,
    purchasePrice,
    expectedSalesPrice,
    vinStatus: vinStatus as Vehicle['vinStatus'],
    exportDeadline,
    vatRisk,
    purchaseDate,
    receiptStatus: receiptStatus as Vehicle['receiptStatus'],
  }
})
