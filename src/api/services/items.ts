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
  const res = await apiClient.get<ApiItem[]>('/api/items/', { params });
  return res.data;
}

export async function fetchItem(id: number): Promise<ApiItem> {
  const res = await apiClient.get<ApiItem>(`/api/items/${id}/`);
  return res.data;
}

export async function createItem(data: ItemCreateRequest): Promise<ApiItem> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('item_type', data.item_type);
  formData.append('category', String(data.category));
  formData.append('location', String(data.location));
  if (data.lost_at) formData.append('lost_at', data.lost_at);
  if (data.found_at) formData.append('found_at', data.found_at);
  if (data.upload_images) {
    data.upload_images.forEach((file) => formData.append('upload_images', file));
  }
  const res = await apiClient.post<ApiItem>('/api/items/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateItem(id: number, data: ItemUpdateRequest): Promise<ApiItem> {
  const formData = new FormData();
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.item_type !== undefined) formData.append('item_type', data.item_type);
  if (data.category !== undefined) formData.append('category', String(data.category));
  if (data.location !== undefined) formData.append('location', String(data.location));
  if (data.lost_at) formData.append('lost_at', data.lost_at);
  if (data.found_at) formData.append('found_at', data.found_at);
  if (data.upload_images) {
    data.upload_images.forEach((file) => formData.append('upload_images', file));
  }
  if (data.existing_image_ids) {
    data.existing_image_ids.forEach((id) => formData.append('existing_image_ids', String(id)));
  }
  const res = await apiClient.patch<ApiItem>(`/api/items/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteItem(id: number): Promise<void> {
  await apiClient.delete(`/api/items/${id}/`);
}
