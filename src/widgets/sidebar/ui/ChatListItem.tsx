import type { Chat } from "@/entities/chat"
import React from "react"

type ChatListItemProps = {
  chat: Chat
  isSelected: boolean
  onSelect: (chatId: string) => void
}

export const ChatListItem = React.memo(function ChatListItem({ chat, isSelected, onSelect }: ChatListItemProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString('ru-Ru', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return date.toLocaleDateString('ru-Ru', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const itemClasses = isSelected ? 'bg-[#2B5278] hover:bg-[#2B5278]' : 'bg-transparent hover:bg-[#202B3A]';

  return (
    <li className={`flex items-center gap-3 py-3 cursor-pointer transition-colors ${itemClasses}`} onClick={() => onSelect(chat.id)}>
      <div className="w-12 h-12 rounded-full bg-[#5288C1] flex items-center justify-center text-white font-semibold shrink-0">
        {chat.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-white font-medium truncate">{chat.name}</span>
          <span className="text-xs text-gray-400 shrin-0 mr-4">{ formatTime(chat.lastMessageDate) }</span>
        </div>
        <span className="text-sm text-gray-400 truncate">
          { chat.lastMessage }
        </span>
      </div>
    </li>
  )
});
