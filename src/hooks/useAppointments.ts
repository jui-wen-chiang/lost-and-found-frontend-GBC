import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '../api/services/appointments';
import type { AppointmentCreateRequest } from '../types/api';
import { claimKeys } from './useClaims';

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AppointmentCreateRequest) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimKeys.mine() });
    },
  });
}
