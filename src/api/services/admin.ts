import apiClient from '../client';
import type { ApiItem } from '../../types/api';

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
