import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type Chat } from '@/entities/chat'
import { useAuthStore } from '@/entities/auth'
import { Modal, Button } from '@/shared'
import { CreateChatForm } from '@/features/create-chat'
import { ChatListItem } from './ChatListItem'
import { LogOut } from 'lucide-react'

type SidebarProps = {
  chats: Chat[]
  selectedChatId: string | null
  onSelectChat: (chatId: string) => void
}

export function Sidebar({ chats, selectedChatId, onSelectChat }: SidebarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-[320px] shrink-0 bg-[#17212B] border-r border-[#0E1621] flex flex-col">

      <div className="px-4 py-3 border-b border-[#0E1621] flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">Chats</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="text-white hover:text-white transition-colors p-1.5 bg-[#5288C1] rounded-lg hover:bg-[#242F3D] px-10 py-2 cursor-pointer"
            title="Выйти из чата"
            aria-label="Выйти"
          >
            <LogOut size={20}/>
          </button>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-10 py-2 text-sm"
            title='Добавить новый чат'
          >
            + New
          </Button>
        </div>
      </div>


      <ul className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <li className="px-4 py-6 text-center text-gray-500 text-sm">
            No chats yet. Create one to start messaging.
          </li>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onSelect={onSelectChat}
            />
          ))
        )}
      </ul>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New chat"
      >
        <CreateChatForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>
    </aside>
  )
}
