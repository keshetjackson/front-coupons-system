import { authService } from "@/services/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
    const queryClient = useQueryClient();
  
    const { data: currentUser, isLoading } = useQuery({
      queryKey: ['auth', 'user'],
      queryFn: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;
        return authService.getCurrentUser();
      },
      staleTime: Infinity,
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
  
    return {
      currentUser,
      isAuthenticated: !!currentUser && !!localStorage.getItem('auth_token'),
      isLoading,
      login: loginMutation.mutate,
      loginError: loginMutation.error,
      logout,
    };
}

