import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHome } from '@/lib/auth';

export default function RootRedirect() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
}
