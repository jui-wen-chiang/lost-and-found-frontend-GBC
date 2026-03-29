import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAppointments, updateAppointmentStatus, fetchAppointmentReminders } from '../api/services/appointments';

export const adminAppointmentKeys = {
  all: ['admin-appointments'] as const,
  list: () => [...adminAppointmentKeys.all, 'list'] as const,
  reminders: () => [...adminAppointmentKeys.all, 'reminders'] as const,
};

export function useAdminAppointments() {
  return useQuery({
    queryKey: adminAppointmentKeys.list(),
    queryFn: fetchAppointments,
  });
}

export function useAppointmentReminders() {
  return useQuery({
    queryKey: adminAppointmentKeys.reminders(),
    queryFn: fetchAppointmentReminders,
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAppointmentKeys.list() });
      queryClient.invalidateQueries({ queryKey: adminAppointmentKeys.reminders() });
    },
  });
}
