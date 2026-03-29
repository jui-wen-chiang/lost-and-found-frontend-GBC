import apiClient from '../client';
import type { ApiAppointment, AppointmentCreateRequest } from '../../types/api';

export async function createAppointment(data: AppointmentCreateRequest): Promise<{ message: string; appointment_id: number }> {
  const res = await apiClient.post<{ message: string; appointment_id: number }>('/api/appointments/', data);
  return res.data;
}

export async function fetchAppointments(): Promise<ApiAppointment[]> {
  const res = await apiClient.get<ApiAppointment[]>('/api/appointments/');
  return res.data;
}

export async function updateAppointmentStatus(id: number, status: string): Promise<{ message: string; status: string }> {
  const res = await apiClient.patch<{ message: string; status: string }>(`/api/appointments/${id}/status/`, { status });
  return res.data;
}

export async function fetchAppointmentReminders(): Promise<{ reminders: { appointment_id: number; scheduled_at: string }[] }> {
  const res = await apiClient.get<{ reminders: { appointment_id: number; scheduled_at: string }[] }>('/api/appointments/reminders/');
  return res.data;
}
