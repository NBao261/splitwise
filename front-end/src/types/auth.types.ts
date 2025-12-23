export interface User {
  _id: string;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  _id: string;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}
