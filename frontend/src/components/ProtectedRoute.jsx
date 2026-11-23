import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token)
  const location = useLocation()

  if (token) return <Outlet />
  return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please register or login to continue.' }} />
}
