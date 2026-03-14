import apiClient from '../client';
import type { ApiCategory } from '../../types/api';

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await apiClient.get<ApiCategory[]>('/api/categories/categories/');
  return res.data;
}
