import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Button } from '@/shared'
import { useChatStore } from '@/entities/chat'
import type { Chat } from '@/entities/chat'
import {
  createChatSchema,
  type CreateChatValues,
} from '../model/create-chat-schema'

type CreateChatFormProps = {
  onSuccess: () => void
}

export function CreateChatForm({ onSuccess }: CreateChatFormProps) {
  const addChat = useChatStore((state) => state.addChat)
  const selectChat = useChatStore((state) => state.selectChat)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateChatValues>({
    resolver: zodResolver(createChatSchema),
    mode: 'onChange',
    defaultValues: {
      phone: '',
      name: '',
    },
  })

  const onSubmit = useCallback((data: CreateChatValues) => {
    const existingChats = useChatStore.getState().chats
    const existing = existingChats.find((c) => c.id === data.phone)

    if (existing) {
      setError('phone', {
        type: 'manual',
        message: 'Чат с таким chatId уже существует',
      })
      return
    }

    const newChat: Chat = {
      id: data.phone,
      name: data.name || data.phone,
      lastMessage: '',
      lastMessageDate: Date.now(),
    }

    addChat(newChat)
    selectChat(newChat.id)
    onSuccess()
  }, [addChat, selectChat, setError, onSuccess])

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log('Ошибки валидации:', errors)
      })}
      className="flex flex-col gap-4"
    >
      <Input
        label="ChatId получателя"
        placeholder="например, 910290429"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Имя (необязательно)"
        placeholder="например, Алиса"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Отмена
        </Button>
        <Button type="submit" className="flex-1">
          Создать чат
        </Button>
      </div>
    </form>
  )
}
