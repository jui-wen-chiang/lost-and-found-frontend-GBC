import apiClient from '../client';
import type { ApiItem, ItemCreateRequest, ItemUpdateRequest, ItemFilters } from '../../types/api';

export async function fetchItems(filters?: ItemFilters): Promise<ApiItem[]> {
  const params: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = String(value);
      }
    });
  }
  const res = await apiClient.get<ApiItem[]>('/api/items/items/', { params });
  return res.data;
}

export async function fetchItem(id: number): Promise<ApiItem> {
  const res = await apiClient.get<ApiItem>(`/api/items/items/${id}/`);
  return res.data;
}

export async function createItem(data: ItemCreateRequest): Promise<ApiItem> {
  const res = await apiClient.post<ApiItem>('/api/items/items/', data);
  return res.data;
}

export async function updateItem(id: number, data: ItemUpdateRequest): Promise<ApiItem> {
  const res = await apiClient.patch<ApiItem>(`/api/items/items/${id}/`, data);
  return res.data;
}

export async function deleteItem(id: number): Promise<void> {
  await apiClient.delete(`/api/items/items/${id}/`);
}
