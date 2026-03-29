import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPendingPosts,
  approvePost,
  rejectPost,
  adminDeletePost,
  fetchAdminUsers,
  updateUserRole,
  fetchVerifiedItems,
} from '../api/services/admin';

export const adminKeys = {
  all: ['admin'] as const,
  pendingPosts: () => [...adminKeys.all, 'pending-posts'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  verifiedItems: () => [...adminKeys.all, 'verified-items'] as const,
};

export function usePendingPosts() {
  return useQuery({
    queryKey: adminKeys.pendingPosts(),
    queryFn: fetchPendingPosts,
  });
}

export function useApprovePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approvePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pendingPosts() });
    },
  });
}

export function useRejectPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => rejectPost(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pendingPosts() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminDeletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pendingPosts() });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: fetchAdminUsers,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useVerifiedItems() {
  return useQuery({
    queryKey: adminKeys.verifiedItems(),
    queryFn: fetchVerifiedItems,
  });
}
