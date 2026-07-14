import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { accountManager, salesManager } from '../mock/users'
import type { User } from '../types/auth.types'
import { UserRole } from '../types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isLogin = computed(() => !!user.value)

  const isAccountManager = computed(() => user.value?.role === UserRole.ACCOUNT_MANAGER)

  const isSalesManager = computed(() => user.value?.role === UserRole.SALES_MANAGER)

  function loginAsAccountManager() {
    user.value = accountManager
  }

  function loginAsSalesManager() {
    user.value = salesManager
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    isLogin,
    isAccountManager,
    isSalesManager,
    loginAsAccountManager,
    loginAsSalesManager,
    logout,
  }
})
