import { gql } from '@apollo/client'

export const GET_MESSAGES = gql`
  query GetMessages($chatId: ID!) {
    messages(chatId: $chatId) @client {
      id
      chatId
      text
      timestamp
      direction
    }
  }
`

export const GET_CHATS = gql`
  query GetChats {
    chats @client {
      id
      name
      lastMessage
      lastMessageDate
    }
  }
`

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    id
    chatId
    text
    timestamp
    direction
  }
`
