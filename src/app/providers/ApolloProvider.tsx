import { type ReactNode } from 'react'
import { ApolloProvider as ApolloProviderLib } from '@apollo/client/react'
import { apolloClient } from '@/shared/lib/graphql/apollo-client'


type ApolloProviderProps = {
  children: ReactNode
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  return (
    <ApolloProviderLib client={apolloClient}>
      {children}
    </ApolloProviderLib>
  )
}
