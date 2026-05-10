/**
 * Activity log domain.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockActivity } from './mocks';
import type { ActivityItem } from './types';
import { useApi } from './useApi';

export function listActivity(signal?: AbortSignal): Promise<ActivityItem[]> {
  if (env.useMocks) return mockResponse(mockActivity, signal);
  return request<ActivityItem[]>(ENDPOINTS.activity.list, { signal });
}

export function useActivity() {
  return useApi<ActivityItem[]>((signal) => listActivity(signal));
}
