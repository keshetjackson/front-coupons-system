import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { userService } from '@/services/users';

export function useUsers() {
  const queryClient = useQueryClient();

  return {
    
    users: useSuspenseQuery({
      queryKey: ['users'],
      queryFn: userService.getAll,
    }),

    
    createUser: useMutation({
      mutationFn: userService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }),

    deleteUser: useMutation({
      mutationFn: userService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }),
  };
}