import { useMutation } from '@tanstack/react-query'
import { sendMessage as sendMessageApi } from '@/shared/api'
import { useAuthStore } from '@/entities/auth'
import { useChatStore } from '@/entities/chat'
import type { Message } from '@/entities/chat'

type SendChatMessageVariables = {
  chatId: string
  text: string
}

function normalizeChatId(chatId: string): string {
  const atIndex = chatId.indexOf('@')
  return atIndex === -1 ? chatId : chatId.substring(0, atIndex)
}

function getRussianErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('401') || msg.includes('unauthorized')) {
      return 'Сессия истекла. Войдите заново.'
    }
    if (msg.includes('466')) {
      return 'Превышен лимит сообщений на бесплатном тарифе.'
    }
    if (msg.includes('400') || msg.includes('validation failed')) {
      return 'Неверный chatId получателя. Проверьте номер.'
    }
    if (msg.includes('failed to fetch') || msg.includes('network')) {
      return 'Нет соединения с сервером. Проверьте интернет.'
    }
    if (msg.includes('quota') || msg.includes('quote')) {
      return 'Превышен лимит сообщений. Подключите платный тариф в GREEN-API.'
    }
    return error.message
  }
  return 'Не удалось отправить сообщение.'
}

export function useSendMessage() {
  const credentials = useAuthStore((state) => state.credentials)
  const addMessage = useChatStore((state) => state.addMessage)

  const mutation = useMutation({
    mutationFn: async (variables: SendChatMessageVariables) => {
      if (!credentials) {
        throw new Error('Не авторизован. Войдите заново.')
      }
      return sendMessageApi(credentials, {
        chatId: variables.chatId,
        message: variables.text,
      })
    },

    onMutate: (variables: SendChatMessageVariables) => {
      const normalizedChatId = normalizeChatId(variables.chatId)

      const optimisticMessage: Message = {
        id: `local-${Date.now()}`,
        chatId: normalizedChatId,
        text: variables.text,
        timestamp: Date.now(),
        direction: 'outgoing',
      }

      addMessage(optimisticMessage)

      return { optimisticMessage }
    },

    onSuccess: (data, variables, context) => {
      if (context?.optimisticMessage && data.idMessage) {
        const store = useChatStore.getState()
        const msgs = store.messagesByChat[context.optimisticMessage.chatId] ?? []
        const updated = msgs.map((m) =>
          m.id === context.optimisticMessage.id
            ? { ...m, id: data.idMessage }
            : m
        )
        useChatStore.setState({
          messagesByChat: {
            ...store.messagesByChat,
            [context.optimisticMessage.chatId]: updated,
          },
        })
      }
    },

    onError: (error) => {
      const russianMessage = getRussianErrorMessage(error)
      console.error('Ошибка отправки:', russianMessage)
      alert(russianMessage)
    },
  })

  return mutation
}
