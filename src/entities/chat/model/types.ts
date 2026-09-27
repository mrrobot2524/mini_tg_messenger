export type Chat = {
  id: string
  name: string
  lastMessage: string
  lastMessageDate: number
}

export type Message = {
  id: string
  chatId: string
  text: string
  timestamp: number
  direction: 'outgoing' | 'incoming'
}
