import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Message {
    id: ID!
    chatId: ID!
    text: String!
    timestamp: Float!
    direction: String!
  }

  type Chat {
    id: ID!
    name: String!
    lastMessage: String!
    lastMessageDate: Float!
  }

  type Query {
    messages(chatId: ID!): [Message!]!
    chats: [Chat!]!
  }
`
