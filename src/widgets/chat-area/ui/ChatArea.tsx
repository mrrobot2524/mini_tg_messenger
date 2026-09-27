import { type Chat, type Message } from '@/entities/chat'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

type ChatAreaProps = {
  chat: Chat | null
  messages: Message[]
  onSendMessage: (text: string) => void
  isSending?: boolean
}

export function ChatArea({
  chat,
  messages,
  onSendMessage,
  isSending = false,
}: ChatAreaProps) {
  if (!chat) {
    return (
      <div className="flex-1 bg-[#0E1621] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#17212B] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#5288C1]">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#0E1621] flex flex-col ">
      <header className="px-4 py-3 border-b border-[#17212B] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#5288C1] flex items-center justify-center text-white font-semibold">
          {chat.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-medium">{chat.name}</span>
          <span className="text-xs text-gray-400">
            {isSending ? 'Sending...' : 'online'}
          </span>
        </div>
      </header>

       <MessageList messages={messages} chatId={chat.id} />

      <MessageInput onSend={onSendMessage} disabled={isSending} />
    </div>
  )
}
