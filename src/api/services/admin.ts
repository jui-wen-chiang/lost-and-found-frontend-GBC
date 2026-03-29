import apiClient from '../client';
import type { ApiItem, ApiUser } from '../../types/api';

export async function fetchPendingPosts(): Promise<ApiItem[]> {
  const res = await apiClient.get<ApiItem[]>('/api/admin/audit/posts/');
  return res.data;
}

export async function approvePost(id: number): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(`/api/admin/items/${id}/approve/`);
  return res.data;
}

export async function rejectPost(id: number, reason?: string): Promise<{ message: string; reason: string }> {
  const res = await apiClient.patch<{ message: string; reason: string }>(`/api/admin/items/${id}/reject/`, { reason });
  return res.data;
}

export async function adminDeletePost(id: number): Promise<{ message: string }> {
  const res = await apiClient.delete<{ message: string }>(`/api/admin/items/${id}/delete/`);
  return res.data;
}

export async function adminEditPost(id: number, data: Partial<ApiItem>): Promise<ApiItem> {
  const res = await apiClient.put<ApiItem>(`/api/admin/items/${id}/edit/`, data);
  return res.data;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'staff' | 'admin';
  is_active: boolean;
  date_joined: string | null;
  last_login: string | null;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await apiClient.get<AdminUser[]>('/api/admin/users/');
  return res.data;
}

export async function updateUserRole(id: number, role: string): Promise<{ message: string; role: string }> {
  const res = await apiClient.patch<{ message: string; role: string }>(`/api/admin/users/${id}/role/`, { role });
  return res.data;
}

export async function fetchVerifiedItems(): Promise<ApiItem[]> {
  const res = await apiClient.get<ApiItem[]>('/api/admin/items/verified/');
  return res.data;
}
