import { Navigate } from 'react-router-dom';
import { authApi } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'citizen' | 'authority';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = authApi.isAuthenticated();
  const userRole = authApi.getUserRole();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific role required and user doesn't have it, redirect
  if (requiredRole && userRole !== requiredRole) {
    if (requiredRole === 'authority') {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/authority/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
