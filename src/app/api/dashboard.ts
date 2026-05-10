/**
 * Dashboard snapshot — drives the Business Portal overview.
 *
 * Mock mode key: the Tweaks Panel state label is forwarded as the `state`
 * query param so the demo stays state-driven without a live backend.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockDashboard } from './mocks';
import type { DashboardSnapshot, DashboardStateLabel } from './types';
import { useApi } from './useApi';

export function getDashboard(
  state: DashboardStateLabel,
  signal?: AbortSignal
): Promise<DashboardSnapshot> {
  if (env.useMocks) return mockResponse(mockDashboard(state), signal);
  return request<DashboardSnapshot>(ENDPOINTS.dashboard.snapshot, {
    signal,
    query: { state },
  });
}

export function useDashboard(state: DashboardStateLabel) {
  return useApi<DashboardSnapshot>((signal) => getDashboard(state, signal), {
    deps: [state],
  });
}
