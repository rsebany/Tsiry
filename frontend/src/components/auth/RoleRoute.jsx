import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHome } from '@/lib/auth';

export default function RoleRoute({ roles }) {
  const { user, hasRole } = useAuth();

  if (!hasRole(...roles)) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return <Outlet />;
}
