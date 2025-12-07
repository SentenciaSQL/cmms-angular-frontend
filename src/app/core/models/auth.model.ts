import {User} from './user.model';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: string[];
}
