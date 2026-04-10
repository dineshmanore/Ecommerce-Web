import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    console.log('AdminRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    console.log('AdminRoute: Not an admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return children;
}
