import { useMemo } from 'react'
import { Sidebar } from '@/widgets/sidebar'
import { ChatArea } from '@/widgets/chat-area'
import { useChatStore } from '@/entities/chat'
import { useSendMessage } from '@/features/send-message'
import { useReceiveNotifications } from '@/features/receive-messages'  // ← добавили

export function ChatPage() {
  const chats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const selectChat = useChatStore((state) => state.selectChat)
  const messagesByChat = useChatStore((state) => state.messagesByChat)

  const sendMessageMutation = useSendMessage()

  useReceiveNotifications()

  const selectedChat = useMemo(() => {
    return chats.find((chat) => chat.id === selectedChatId) ?? null
  }, [chats, selectedChatId])

  const messages = useMemo(() => {
    if (!selectedChatId) return []
    return messagesByChat[selectedChatId] ?? []
  }, [messagesByChat, selectedChatId])

  const handleSelectChat = selectChat

  const handleSendMessage = (text: string) => {
    if (!selectedChatId) return
    if (sendMessageMutation.isPending) return
    sendMessageMutation.mutate({ chatId: selectedChatId, text })
  }

  return (
    <div className="h-screen w-screen flex bg-[#0E1621] overflow-hidden">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
      />
      <ChatArea
        chat={selectedChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        isSending={sendMessageMutation.isPending}
      />
    </div>
  )
}
