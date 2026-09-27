import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from '@/app/providers/router'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ApolloProvider } from '@/app/providers/ApolloProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ApolloProvider>
        <RouterProvider router={router} />
      </ApolloProvider>
    </QueryProvider>
  </StrictMode>,
)
