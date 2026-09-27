import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'

export const apolloClient = new ApolloClient({
  link: ApolloLink.empty(),
  cache: new InMemoryCache(),
})
