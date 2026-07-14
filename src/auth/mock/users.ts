import { UserRole, type User } from '../types/auth.types'

export const accountManager: User = {
  id: '1',
  name: '풀링회계',
  department: '회계팀',
  position: '팀장',
  role: UserRole.ACCOUNT_MANAGER,
}

export const salesManager: User = {
  id: '2',
  name: '풀링영업',
  department: '영업팀',
  position: '총괄',
  role: UserRole.SALES_MANAGER,
}
