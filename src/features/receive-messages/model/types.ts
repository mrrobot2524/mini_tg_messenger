export type GreenApiNotification = {
  receiptId: number
  body: {
    typeWebhook: string
    instanceData: {
      idInstance: number
      wid: string
    }
    timestamp: number
    idMessage: string
    senderData: {
      chatId: string
      chatName: string | null
      sender: string
      senderName: string | null
    }
    messageData: {
      typeMessage: string
      textMessageData?: {
        textMessage: string
      }
      extendedTextMessageData?: {
        text: string
      }
    }
  }
}
