import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated || !currentUser) {
          navigate('/login', { 
            replace: true,
            state: { from: location.pathname }
          });
        } else if (!currentUser.isAdmin) {
          navigate('/', { replace: true });
        }
      }
    }, [isAuthenticated, isLoading, currentUser, navigate, location]);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    return (isAuthenticated && currentUser?.isAdmin) ? <Outlet /> : null;
  };