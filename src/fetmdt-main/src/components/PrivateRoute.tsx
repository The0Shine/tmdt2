import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
    children: ReactNode
    role?: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null') as {
        username: string
        role: string
    } | null

    if (!user) return <Navigate to="/login" replace />
    if (role && user.role !== role) return <Navigate to="/" replace />

    return <>{children}</>
}

export default PrivateRoute
