import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chat, Message } from './types'

function normalizeChatId(chatId: string): string {
  const atIndex = chatId.indexOf('@')
  return atIndex === -1 ? chatId : chatId.substring(0, atIndex)
}

type ChatStore = {
  chats: Chat[]
  messagesByChat: Record<string, Message[]>
  selectedChatId: string | null

  addChat: (chat: Chat) => void
  removeChat: (chatId: string) => void
  selectChat: (chatId: string | null) => void

  addMessage: (message: Message) => void

  getMessages: (chatId: string) => Message[]
  clearAll: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      messagesByChat: {},
      selectedChatId: null,

      addChat: (chat) =>
        set((state) => {
          const normalizedChat = { ...chat, id: normalizeChatId(chat.id) }

          if (state.chats.some((c) => c.id === normalizedChat.id)) {
            return state
          }
          return {
            chats: [normalizedChat, ...state.chats],
            messagesByChat: {
              ...state.messagesByChat,
              [normalizedChat.id]: state.messagesByChat[normalizedChat.id] ?? [],
            },
          }
        }),

      removeChat: (chatId) =>
        set((state) => {
          const normalizedId = normalizeChatId(chatId)
          const newChats = state.chats.filter((c) => c.id !== normalizedId)
          const newMessages = { ...state.messagesByChat }
          delete newMessages[normalizedId]
          const newSelected =
            state.selectedChatId === normalizedId ? null : state.selectedChatId
          return {
            chats: newChats,
            messagesByChat: newMessages,
            selectedChatId: newSelected,
          }
        }),

      selectChat: (chatId) =>
        set({ selectedChatId: chatId ? normalizeChatId(chatId) : null }),

      addMessage: (message) =>
        set((state) => {
          const normalizedMessage = {
            ...message,
            chatId: normalizeChatId(message.chatId),
          }

          const currentMessages = state.messagesByChat[normalizedMessage.chatId] ?? []

          if (currentMessages.some((m) => m.id === normalizedMessage.id)) {
            return state
          }

          const newMessages = [...currentMessages, normalizedMessage]

          const newChats = state.chats.map((chat) =>
            chat.id === normalizedMessage.chatId
              ? {
                  ...chat,
                  lastMessage: normalizedMessage.text,
                  lastMessageDate: normalizedMessage.timestamp,
                }
              : chat
          )

          return {
            messagesByChat: {
              ...state.messagesByChat,
              [normalizedMessage.chatId]: newMessages,
            },
            chats: newChats,
          }
        }),

      getMessages: (chatId) => {
        const normalizedId = normalizeChatId(chatId)
        return get().messagesByChat[normalizedId] ?? []
      },

      clearAll: () =>
        set({ chats: [], messagesByChat: {}, selectedChatId: null }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        selectedChatId: state.selectedChatId,
        messagesByChat: state.messagesByChat,
      }),
    }
  )
)
if (typeof window !== 'undefined') {
  ;(window as any).useChatStore = useChatStore
}
