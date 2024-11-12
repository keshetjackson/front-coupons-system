import { authService } from "@/services/auth";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export function useAuth() {
    const queryClient = useQueryClient();
  
    const { data: currentUser, isLoading } = useSuspenseQuery({
      queryKey: ['auth', 'user'],
      queryFn: authService.getCurrentUser,
      staleTime: Infinity, // Don't refetch automatically
    });
  
    const loginMutation = useMutation({
      mutationFn: authService.login,
      onSuccess: (user) => {
        queryClient.setQueryData(['auth', 'user'], user);
      },
    });
  
    const logout = () => {
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    };
  
    const createUserMutation = useMutation({
      mutationFn: authService.createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      },
    });
  
    return {
      currentUser,
      isAuthenticated: !!currentUser,
      isLoading,
      login: loginMutation.mutate,
      loginError: loginMutation.error,
      logout,
      createUser: createUserMutation.mutate,
    };
  }
  
  
  export function useRequireAuth() {
    const { isAuthenticated, isLoading, currentUser } = useAuth();
    
    return {
      isLoading,
      isAuthenticated,
      currentUser,
      requireAdmin: !!currentUser?.isAdmin,
    };
  }