import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'location_admin';
}

export default function AdminProtectedRoute({ children, requiredRole }: Props) {
  const { adminUser, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!adminUser) return <Navigate to="/admin-login" replace />;

  if (requiredRole && adminUser.role !== requiredRole && adminUser.role !== 'super_admin') {
    return <Navigate to="/location-admin" replace />;
  }

  return <>{children}</>;
}
