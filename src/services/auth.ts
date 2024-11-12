import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { withDelay } from '@/lib/reactQuery';
import type { LoginInput } from '@/types/auth';
import { User } from '@/types/user';

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

export const authService = {
  login: async (credentials: LoginInput) => 
    withDelay(
      fetch(`${API_URL}/users?username=${credentials.username}&password=${credentials.password}`)
        .then(res => res.json())
        .then(users => {
          const user = users[0];
          if (!user) throw new Error('Invalid credentials');
          // Store token in localStorage on successful login
          localStorage.setItem('auth_token', 'mock-jwt-token');
          return user;
        })
    ),

  getCurrentUser: async (): Promise<User | null> =>
    withDelay(
      fetch(`${API_URL}/users/1`)
        .then(res => res.json())
        .catch(() => null)
    ),

  createUser: async (user: Omit<User, 'id' | 'createdAt'>) =>
    withDelay(
      fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          createdAt: new Date().toISOString(),
        }),
      }).then(res => res.json())
    ),
};

