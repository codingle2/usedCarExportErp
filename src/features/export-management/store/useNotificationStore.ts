import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BusinessNotificationEvent, NOTI_LEVEL } from '@/constants/notification.constants'

export interface AppNotification {
  id: string
  event: BusinessNotificationEvent
  createdAt: Date
  isRead: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<AppNotification[]>([])

  const unreadCount = computed(() => notifications.value.filter((n) => !n.isRead).length)

  const sortedNotifications = computed(() => {
    return [...notifications.value].sort((a, b) => {
      if (a.event.level !== b.event.level) {
        return b.event.level - a.event.level
      }
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  })

  // 사용자 알림 누적 및 Webhook(Slack/Discord) 연동 처리 기능은 당연히 없고요
  const captureNotification = (event: BusinessNotificationEvent) => {
    // 1. CRITICAL 레벨 이상이면 외부 메신저로 알림 전송 (프로토타입 팝업)
    if (event.level >= NOTI_LEVEL.CRITICAL) {
      setTimeout(() => {
        alert(
          `🔔 [웹훅 전송 완료]\nSlack 및 Discord '#긴급-통제-알림' 채널로 메시지가 발송되었습니다.\n\n발생 사유: ${event.message}`,
        )
      }, 100) // UI 흐름을 막지 않도록 약간의 지연
    }

    // 2. 알림 센터에 데이터 누적
    notifications.value.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      event,
      createdAt: new Date(),
      isRead: false,
    })
  }

  const markAsRead = (id: string) => {
    const noti = notifications.value.find((n) => n.id === id)
    if (noti) noti.isRead = true
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    unreadCount,
    sortedNotifications,
    captureNotification,
    markAsRead,
    clearAll,
  }
})
