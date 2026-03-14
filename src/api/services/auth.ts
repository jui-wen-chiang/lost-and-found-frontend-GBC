import apiClient from '../client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LogoutRequest } from '../../types/api';

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/api/auth/login/', data);
  return res.data;
}

export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await apiClient.post<RegisterResponse>('/api/auth/register/', data);
  return res.data;
}

export async function logoutApi(data: LogoutRequest): Promise<void> {
  await apiClient.post('/api/auth/logout/', data);
}
