import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchUnclaimedItems } from '../api/services/reports';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: fetchDashboardStats,
  });
}

export function useUnclaimedItems() {
  return useQuery({
    queryKey: ['reports', 'unclaimed'],
    queryFn: fetchUnclaimedItems,
  });
}
