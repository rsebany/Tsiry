import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHome } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function GuestRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children;
}
