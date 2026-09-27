import { useEffect, useRef } from 'react'
import { type Message } from '@/entities/chat'

type MessageListProps = {
  messages: Message[]
  chatId: string | null
}

export function MessageList({ messages, chatId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        No messages yet. Say hi!
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 no-scrollbar">
      {messages.map((message) => {
        const isOutgoing = message.direction === 'outgoing'

        const bubbleClasses = isOutgoing
          ? 'bg-[#2B5278] text-white self-end rounded-br-none'
          : 'bg-[#182533] text-white self-start rounded-bl-none'

        return (
          <div
            key={message.id}
            className={`max-w-[70%] px-3 py-2 rounded-2xl ${bubbleClasses}`}
          >
            <p className="wrap-break-words whitespace-pre-wrap">{message.text}</p>
            <span
              className={`text-[10px] mt-1 block ${
                isOutgoing ? 'text-blue-200' : 'text-gray-400'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )
      })}

      <div ref={bottomRef} />
    </div>
  )
}
