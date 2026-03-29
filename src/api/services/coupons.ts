import apiClient from '../client';
import type { ApiCoupon } from '../../types/api';

export async function fetchUserCoupons(): Promise<ApiCoupon[]> {
  const res = await apiClient.get<ApiCoupon[]>('/api/coupons/');
  return res.data;
}

export async function activateCoupon(code: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/api/coupons/activate/', { code });
  return res.data;
}
