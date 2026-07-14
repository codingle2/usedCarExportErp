// 1. 시스템 및 개발자 관점의 에러 코드만 남김 (비즈니스 로직 배제)
export const SYS_ERROR_CODES = {
  // 인프라 / 네트워크 관련
  NETWORK_TIMEOUT: 'ERR_SYS_001',
  EXTERNAL_API_FAILED: 'ERR_SYS_002', // (예: 교통안전공단 서버 다운)
  UNKNOWN_ERROR: 'ERR_SYS_999',

  // 인증 / 인가 관련 (401, 403)
  UNAUTHORIZED: 'ERR_AUTH_001',
  SESSION_EXPIRED: 'ERR_AUTH_002',

  // 데이터 무결성 및 클라이언트 잘못된 요청 (400)
  INVALID_PAYLOAD: 'ERR_REQ_001',
  STATE_TRANSITION_DENIED: 'ERR_REQ_002', // (예: 이미 보류된 걸 또 보류하려는 API 호출)
  DATA_NOT_FOUND: 'ERR_REQ_003', // (예: DB에 없는 차량 ID 조회)
} as const

export type SysErrorCode = (typeof SYS_ERROR_CODES)[keyof typeof SYS_ERROR_CODES]

// 2. 개발자 로깅용 심각도 (Sentry, Datadog 등 에러 수집 도구와 연동하기 위함)
export const SYS_ERROR_LEVEL = {
  FATAL: 'FATAL', // 앱 크래시, DB 다운 (슬랙 #dev-alert 채널로 즉시 전송)
  ERROR: 'ERROR', // 특정 기능 작동안함 (API 500)
  WARN: 'WARN', // 클라이언트 실수나 일시적 타임아웃 (무시 가능)
} as const

export type SysErrorLevel = (typeof SYS_ERROR_LEVEL)[keyof typeof SYS_ERROR_LEVEL]

// 3. 에러 메타 정보 (사용자 노출용 텍스트 + 로깅 레벨)
// *참고: 여기 있는 텍스트는 종소리 알림이 아니라, 화면 중앙에 "잠시 후 다시 시도해주세요" 처럼 띄우는 용도입니다.
export const SYS_ERROR_META: Record<SysErrorCode, { message: string; level: SysErrorLevel }> = {
  [SYS_ERROR_CODES.NETWORK_TIMEOUT]: {
    message: '서버 응답 시간이 초과되었습니다.',
    level: SYS_ERROR_LEVEL.WARN,
  },
  [SYS_ERROR_CODES.EXTERNAL_API_FAILED]: {
    message: '외부 서버와 통신할 수 없습니다.',
    level: SYS_ERROR_LEVEL.ERROR,
  },
  [SYS_ERROR_CODES.UNKNOWN_ERROR]: {
    message: '일시적인 시스템 오류가 발생했습니다.',
    level: SYS_ERROR_LEVEL.FATAL,
  },

  [SYS_ERROR_CODES.UNAUTHORIZED]: { message: '접근 권한이 없습니다.', level: SYS_ERROR_LEVEL.WARN },
  [SYS_ERROR_CODES.SESSION_EXPIRED]: {
    message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
    level: SYS_ERROR_LEVEL.WARN,
  },

  [SYS_ERROR_CODES.INVALID_PAYLOAD]: {
    message: '잘못된 데이터 형식입니다.',
    level: SYS_ERROR_LEVEL.WARN,
  },
  [SYS_ERROR_CODES.STATE_TRANSITION_DENIED]: {
    message: '현재 상태에서는 해당 처리를 할 수 없습니다.',
    level: SYS_ERROR_LEVEL.WARN,
  },
  [SYS_ERROR_CODES.DATA_NOT_FOUND]: {
    message: '요청하신 데이터를 찾을 수 없습니다.',
    level: SYS_ERROR_LEVEL.WARN,
  },
}

// 4. 개발자 전용 시스템 에러 객체 (SystemError)
export class SystemError extends Error {
  code: SysErrorCode
  level: SysErrorLevel
  originalError?: unknown // 실제 자바스크립트/Axios 에러 객체를 담아서 디버깅할 때 사용

  constructor(code: SysErrorCode, originalError?: unknown) {
    const meta = SYS_ERROR_META[code] || {
      message: '알 수 없는 시스템 오류가 발생했습니다.',
      level: SYS_ERROR_LEVEL.FATAL,
    }
    super(meta.message)
    this.code = code
    this.level = meta.level
    this.originalError = originalError
    this.name = 'SystemError'
  }
}
