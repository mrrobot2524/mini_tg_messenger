import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from "@/entities/auth";


export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/" replace/>
  }

  return <Outlet/>
}
