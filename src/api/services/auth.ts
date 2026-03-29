import apiClient from '../client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LogoutRequest, PasswordResetRequest, PasswordResetConfirmRequest } from '../../types/api';

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

export async function requestPasswordResetApi(data: PasswordResetRequest): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/api/auth/password-reset/', data);
  return res.data;
}

export async function confirmPasswordResetApi(data: PasswordResetConfirmRequest): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/api/auth/password-reset/confirm/', data);
  return res.data;
}
