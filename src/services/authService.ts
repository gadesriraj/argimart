import { apiClient } from './apiClient';
import { User, UserRole } from '../types';

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('harvesthub_jwt_token', res.data.token);
    }
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('harvesthub_jwt_token', res.data.token);
    }
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('harvesthub_jwt_token');
  }
};
