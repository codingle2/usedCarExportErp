export enum UserRole {
  ACCOUNT_MANAGER = 'ACCOUNT_MANAGER', // 회계팀장
  SALES_MANAGER = 'SALES_MANAGER', // 영업총괄
}

export interface User {
  id: string
  name: string
  department: string
  position: string
  role: UserRole
}
