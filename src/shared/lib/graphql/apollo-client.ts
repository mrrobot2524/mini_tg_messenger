import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { typeDefs } from './shcema'

export const apolloClient = new ApolloClient({
  link: ApolloLink.empty(),
  cache: new InMemoryCache(),
  typeDefs,
  connectToDevTools: import.meta.env.DEV,
})
