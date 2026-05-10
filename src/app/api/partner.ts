/**
 * Partner portal — managed clients + revenue / compliance analytics.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockPartnerAnalytics, mockPartnerClients } from './mocks';
import type { PartnerAnalytics, PartnerClient } from './types';
import { useApi } from './useApi';

export function listPartnerClients(signal?: AbortSignal): Promise<PartnerClient[]> {
  if (env.useMocks) return mockResponse(mockPartnerClients, signal);
  return request<PartnerClient[]>(ENDPOINTS.partner.clients, { signal });
}

export function usePartnerClients() {
  return useApi<PartnerClient[]>((signal) => listPartnerClients(signal));
}

export function getPartnerAnalytics(signal?: AbortSignal): Promise<PartnerAnalytics> {
  if (env.useMocks) return mockResponse(mockPartnerAnalytics, signal);
  return request<PartnerAnalytics>(ENDPOINTS.partner.analytics, { signal });
}

export function usePartnerAnalytics() {
  return useApi<PartnerAnalytics>((signal) => getPartnerAnalytics(signal));
}
