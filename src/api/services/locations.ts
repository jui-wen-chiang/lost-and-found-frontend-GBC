import apiClient from '../client';
import type { ApiLocation } from '../../types/api';

export async function fetchLocations(): Promise<ApiLocation[]> {
  const res = await apiClient.get<ApiLocation[]>('/api/locations/locations/');
  return res.data;
}
