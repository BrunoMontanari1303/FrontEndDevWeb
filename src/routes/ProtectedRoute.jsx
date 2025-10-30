import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '/src/features/auth/useAuthStore'


export default function ProtectedRoute() {
    const { token } = useAuthStore()
    return token ? <Outlet /> : <Navigate to="/login" replace />
}