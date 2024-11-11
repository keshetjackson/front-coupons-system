export interface User {
    id: string;
    username: string;
    isAdmin: boolean;
    createdAt: string;
  }
  
  export interface UserInput {
    username: string;
    password: string;
    isAdmin: boolean;
  }