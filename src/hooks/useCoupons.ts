import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserCoupons, activateCoupon } from '../api/services/coupons';

export const couponKeys = {
  all: ['coupons'] as const,
  mine: () => [...couponKeys.all, 'mine'] as const,
};

export function useUserCoupons() {
  return useQuery({
    queryKey: couponKeys.mine(),
    queryFn: fetchUserCoupons,
  });
}

export function useActivateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => activateCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.mine() });
    },
  });
}
