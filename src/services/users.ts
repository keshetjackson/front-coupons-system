import { withDelay } from '@/lib/reactQuery';
import { UserInput } from '@/types/user';

const API_URL = 'http://localhost:3001';



export const userService = {
  getAll: () => 
    withDelay(
      fetch(`${API_URL}/users`).then(res => res.json())
    ),

  create: (data: UserInput) =>
    withDelay(
      fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        }),
      }).then(res => res.json())
    ),

  delete: (id: string) =>
    withDelay(
      fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      }).then(res => res.json())
    ),
};