export {
  sendMessage,
  getStateInstance,
  receiveNotification,
  deleteNotification,
  getLastIncomingMessages,
  getLastOutgoingMessages,
} from './green-api-client'

export type {
  SendMessageResponse,
  GetStateInstanceResponse,
  LastIncomingMessage,
  LastIncomingMessagesResponse,
  LastOutgoingMessage,
  LastOutgoingMessagesResponse,
} from './green-api-client'
