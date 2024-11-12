import { useRequireAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? <Outlet /> : null;
}