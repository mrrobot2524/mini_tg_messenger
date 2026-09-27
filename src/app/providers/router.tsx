import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/login'
import { ChatPage } from '@/pages/chat'
import { PublicRoute } from './PublicRoute'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/chat',
        element: <ChatPage />,
      },
    ],
  },
])
