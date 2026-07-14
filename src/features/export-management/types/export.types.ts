export type DocStatus = '완비' | '일부 누락'
export type ShipmentStatus = '선적 완료' | '조건부 선적' | '선적 보류' | '조회대기'
export type PipelineTab = 'all' | '증빙/재무미흡' | '법적/세무미흡' | '승인대기' | '선적가능'
export type VinStatus = '정상' | '도난 의심' | '압류 상태' | '미조회'
export type ReceiptStatus = '발행 대기' | '발행 완료'

export interface Dealer {
  id: string // 나중에 딜러 페이지에서 사용될 고유 ID
  company: string
  name: string
  phone: string
  businessCardUrl: string | null // 명함 이미지 주소
}

export interface Vehicle {
  id: string
  vin: string
  model: string
  docStatus: DocStatus
  shipmentStatus: ShipmentStatus
  buyerName: string // 우리 회사 매입 담당자
  dealer: Dealer // 상대방(매입처) 정보

  // 리스크 관리용 필드
  purchasePrice: number // 매입가 (만원 단위)
  expectedSalesPrice: number // 예상 매출가 (만원 단위)
  vinStatus: VinStatus // 차대번호 상태
  exportDeadline: string // 수출 이행 기한 (부가세 환급용)
  vatRisk: number // 예상 부가세 손실액

  // 증빙 관리용 필드 추가
  purchaseDate: string
  receiptStatus: ReceiptStatus
}

export interface ExportFilters {
  tab: PipelineTab
  query: string
  docStatus: string // 서류 상태 필터
  riskStatus: 'all' | 'safe' | 'risk' // 리스크 상태 필터 추가
}
