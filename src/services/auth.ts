import { withDelay } from "@/lib/reactQuery";
import { LoginInput } from "@/types/auth";
import { User } from "@/types/user";

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';


export const authService = {
    login: async (credentials: LoginInput) => 
      withDelay(
        fetch(`${API_URL}/users?username=${credentials.username}&password=${credentials.password}`)
          .then(res => res.json())
          .then(users => {
            const user = users[0];
            if (!user) throw new Error('Invalid credentials');
            if (!user.isAdmin) throw new Error('Access denied: Admin access required');
            localStorage.setItem('auth_token', 'mock-jwt-token');
            return user;
          })
      ),
  
    getCurrentUser: async (): Promise<User | null> => {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
  
      return withDelay(
        fetch(`${API_URL}/users/1`)
          .then(res => res.json())
          .then(user => {
            if (!user) {
              localStorage.removeItem('auth_token');
              return null;
            }
            return user;
          })
          .catch(() => {
            localStorage.removeItem('auth_token');
            return null;
          })
      );
    },
  };