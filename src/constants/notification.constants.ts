// 사용자에게 보여줄 알림

// 1. 알림 레벨 정의
export const NOTI_LEVEL = {
  INFO: 1, // 💡 단순 안내 (선적 보류 완료 등)
  WARNING: 2, // ⚠️ 주의 요망 (기한 임박)
  CRITICAL: 3, // 🚨 즉각 조치 및 외부(Slack) 연동 필요 (역마진, 압류)
} as const

export type NotiLevel = (typeof NOTI_LEVEL)[keyof typeof NOTI_LEVEL]

// 2. 비즈니스 알림 코드 정의 (사용자가 알아야 할 업무적 알림)
export const NOTI_CODES = {
  // 재무 통제 알림
  FINANCE_NEGATIVE_MARGIN: 'NOTI_FIN_001',
  FINANCE_VAT_OVERDUE: 'NOTI_FIN_002',

  // 리스크 통제 알림
  VIN_SEIZED_OR_STOLEN: 'NOTI_VIN_001',
  SHIPMENT_FORCE_HELD: 'NOTI_EXP_001',
} as const

export type NotiCode = (typeof NOTI_CODES)[keyof typeof NOTI_CODES]

// 3. 사용자 노출용 메시지 및 레벨 맵핑
export const NOTI_META: Record<NotiCode, { message: string; level: NotiLevel }> = {
  [NOTI_CODES.FINANCE_NEGATIVE_MARGIN]: {
    message: '역마진 발생! 특별 승인이 필요합니다.',
    level: NOTI_LEVEL.CRITICAL,
  },
  [NOTI_CODES.FINANCE_VAT_OVERDUE]: {
    message: '수출 기한 초과 위험! 부가세 손실이 예상됩니다.',
    level: NOTI_LEVEL.CRITICAL,
  },
  [NOTI_CODES.VIN_SEIZED_OR_STOLEN]: {
    message: '선적 불가: 차량 압류/저당 상태가 감지되었습니다.',
    level: NOTI_LEVEL.CRITICAL,
  },
  [NOTI_CODES.SHIPMENT_FORCE_HELD]: {
    message: '회계팀장 직권으로 선적이 보류되었습니다.',
    level: NOTI_LEVEL.INFO,
  },
}
export class BusinessNotificationEvent<T = Record<string, unknown>> {
  code: NotiCode
  level: NotiLevel
  message: string
  context?: T // 제네릭 타입 T 사용

  constructor(code: NotiCode, context?: T) {
    const meta = NOTI_META[code]
    this.code = code
    this.level = meta.level
    this.message = meta.message
    this.context = context
  }
}
