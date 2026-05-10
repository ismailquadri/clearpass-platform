/**
 * Alerts domain — list, mark read, dismiss.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockAlerts } from './mocks';
import type { Alert } from './types';
import { useApi, useMutation } from './useApi';

export function listAlerts(signal?: AbortSignal): Promise<Alert[]> {
  if (env.useMocks) return mockResponse(mockAlerts, signal);
  return request<Alert[]>(ENDPOINTS.alerts.list, { signal });
}

export function useAlerts() {
  return useApi<Alert[]>((signal) => listAlerts(signal));
}

export async function markAlertRead(id: string): Promise<void> {
  if (env.useMocks) {
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.alerts.markRead(id), { method: 'POST' });
}

export function useMarkAlertRead() {
  return useMutation<string, void>(markAlertRead);
}

export async function markAllAlertsRead(): Promise<void> {
  if (env.useMocks) {
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.alerts.markAllRead, { method: 'POST' });
}

export function useMarkAllAlertsRead() {
  return useMutation<void, void>(markAllAlertsRead);
}

export async function dismissAlert(id: string): Promise<void> {
  if (env.useMocks) {
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.alerts.dismiss(id), { method: 'DELETE' });
}

export function useDismissAlert() {
  return useMutation<string, void>(dismissAlert);
}
