import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyClaims, createClaim } from '../api/services/claims';
import type { ClaimCreateRequest } from '../types/api';

export const claimKeys = {
  all: ['claims'] as const,
  mine: () => [...claimKeys.all, 'mine'] as const,
};

export function useMyClaims() {
  return useQuery({
    queryKey: claimKeys.mine(),
    queryFn: fetchMyClaims,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClaimCreateRequest) => createClaim(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimKeys.mine() });
    },
  });
}
