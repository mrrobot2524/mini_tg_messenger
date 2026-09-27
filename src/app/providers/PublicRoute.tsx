import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/entities/auth'

export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />
  }

  return <Outlet />
}
