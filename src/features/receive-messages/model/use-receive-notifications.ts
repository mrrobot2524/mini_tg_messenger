import { useEffect, useRef } from 'react'
import { getLastIncomingMessages, getLastOutgoingMessages } from '@/shared/api'
import { useAuthStore } from '@/entities/auth'
import { useChatStore } from '@/entities/chat'
import type { Message } from '@/entities/chat'
import type { LastIncomingMessage, LastOutgoingMessage } from '@/shared/api'

const POLLING_INTERVAL = 5000

export function useReceiveNotifications() {
  const credentials = useAuthStore((state) => state.credentials)
  const addMessage = useChatStore((state) => state.addMessage)
  const addChat = useChatStore((state) => state.addChat)

  const processedIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!credentials) {
      console.log('Polling не запущен: нет кредов')
      return
    }

    console.log('Polling запущен с кредами:', credentials.idInstance)

    let isCancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const processIncomingMessage = (msg: LastIncomingMessage) => {
      if (processedIdsRef.current.has(msg.idMessage)) return false

      const senderChatId = msg.chatId
      const senderName = msg.senderName || msg.chatId
      const text = msg.textMessage

      if (!text) return false

      processedIdsRef.current.add(msg.idMessage)

      const existingChats = useChatStore.getState().chats
      if (!existingChats.some((c) => c.id === senderChatId)) {
        addChat({
          id: senderChatId,
          name: senderName,
          lastMessage: text,
          lastMessageDate: msg.timestamp * 1000,
        })
      }

      const incomingMessage: Message = {
        id: msg.idMessage,
        chatId: senderChatId,
        text,
        timestamp: msg.timestamp * 1000,
        direction: 'incoming',
      }
      addMessage(incomingMessage)
      console.log('Получено входящее сообщение:', text)
      return true
    }

    const processOutgoingMessage = (msg: LastOutgoingMessage) => {
      if (processedIdsRef.current.has(msg.idMessage)) return false

      const senderChatId = msg.chatId
      const senderName = msg.senderName || msg.chatId
      const text = msg.textMessage

      if (!text) return false

      processedIdsRef.current.add(msg.idMessage)

      const existingChats = useChatStore.getState().chats
      if (!existingChats.some((c) => c.id === senderChatId)) {
        addChat({
          id: senderChatId,
          name: senderName,
          lastMessage: text,
          lastMessageDate: msg.timestamp * 1000,
        })
      }

      const outgoingMessage: Message = {
        id: msg.idMessage,
        chatId: senderChatId,
        text,
        timestamp: msg.timestamp * 1000,
        direction: 'outgoing',
      }
      addMessage(outgoingMessage)
      console.log('Получено исходящее сообщение (из Telegram):', text)
      return true
    }

    const poll = async () => {
      if (isCancelled) return

      try {
        const [incoming, outgoing] = await Promise.all([
          getLastIncomingMessages(credentials),
          getLastOutgoingMessages(credentials),
        ])

        if (!isCancelled) {
          if (incoming && incoming.length > 0) {
            incoming.forEach(processIncomingMessage)
          }
          if (outgoing && outgoing.length > 0) {
            outgoing.forEach(processOutgoingMessage)
          }
        }
      } catch (error) {
        console.error('Ошибка polling:', error)
      }

      if (!isCancelled) {
        timeoutId = setTimeout(poll, POLLING_INTERVAL)
      }
    }

    poll()

    return () => {
      isCancelled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
        console.log('Polling остановлен')
      }
    }
  }, [credentials, addMessage, addChat])
}
