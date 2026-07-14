src/
├── assets/
│ └── styles/
│ ├── variables.css # 전역 CSS 변수 (색상, 폰트 등)
│ └── global.css # 전역 리셋 및 기본 스타일
├── components/
│ └── ui/ # 도메인에 종속되지 않는 공통 UI 컴포넌트
│ └── StatusBadge.vue # 상태 뱃지 컴포넌트
├── constants/
│ └── export.constants.ts # 하드코딩된 텍스트, 상태 매핑 상수화
├── layouts/ # 페이지 레이아웃 컴포넌트
│ ├── ErpLayout.vue
│ ├── Sidebar.vue
│ └── Header.vue
├── features/
│ └── export-management/ # '수출 관리' 도메인
│ ├── components/ # 수출 관리 전용 UI 컴포넌트
│ │ ├── ExportPipeline.vue # 상단 파이프라인 카드
│ │ ├── VehicleFilters.vue # 검색 및 필터링
│ │ └── VehicleTable.vue # 차량 데이터 테이블
│ ├── store/
│ │ └── useExportStore.ts # 수출 관리 비즈니스 로직 & 상태 (Pinia)
│ └── types/
│ └── export.types.ts # TypeScript 타입 정의
├── views/
│ └── ExportDashboard.vue # 레이아웃과 Feature 컴포넌트를 조립하는 최상위 View
└── main.ts
