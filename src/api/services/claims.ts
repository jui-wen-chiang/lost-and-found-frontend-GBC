import apiClient from '../client';
import type { ApiClaim, ClaimCreateRequest } from '../../types/api';

export async function createClaim(data: ClaimCreateRequest): Promise<ApiClaim> {
  const res = await apiClient.post<ApiClaim>('/api/claims/', data);
  return res.data;
}

export async function fetchMyClaims(): Promise<ApiClaim[]> {
  const res = await apiClient.get<ApiClaim[]>('/api/claims/my/');
  return res.data;
}
