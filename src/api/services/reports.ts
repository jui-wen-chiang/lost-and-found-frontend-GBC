import apiClient from '../client';
import type { DashboardStats, UnclaimedReport } from '../../types/api';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient.get<DashboardStats>('/api/reports/items/');
  return res.data;
}

export async function fetchUnclaimedItems(): Promise<UnclaimedReport> {
  const res = await apiClient.get<UnclaimedReport>('/api/reports/unclaimed-item/');
  return res.data;
}
