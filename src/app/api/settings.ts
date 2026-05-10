/**
 * Settings — profile + notification preferences.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockNotificationPreferences, mockUserProfile } from './mocks';
import type { NotificationPreferences, UserProfile } from './types';
import { useApi, useMutation } from './useApi';

export function getProfile(signal?: AbortSignal): Promise<UserProfile> {
  if (env.useMocks) return mockResponse(mockUserProfile, signal);
  return request<UserProfile>(ENDPOINTS.settings.profile, { signal });
}

export function useProfile() {
  return useApi<UserProfile>((signal) => getProfile(signal));
}

export async function updateProfile(input: Partial<UserProfile>): Promise<UserProfile> {
  if (env.useMocks) return mockResponse({ ...mockUserProfile, ...input });
  return request<UserProfile>(ENDPOINTS.settings.profile, {
    method: 'PATCH',
    body: input,
  });
}

export function useUpdateProfile() {
  return useMutation<Partial<UserProfile>, UserProfile>(updateProfile);
}

export function getNotificationPreferences(signal?: AbortSignal): Promise<NotificationPreferences> {
  if (env.useMocks) return mockResponse(mockNotificationPreferences, signal);
  return request<NotificationPreferences>(ENDPOINTS.settings.notifications, {
    signal,
  });
}

export function useNotificationPreferences() {
  return useApi<NotificationPreferences>((signal) => getNotificationPreferences(signal));
}

export async function updateNotificationPreferences(
  input: NotificationPreferences
): Promise<NotificationPreferences> {
  if (env.useMocks) return mockResponse(input);
  return request<NotificationPreferences>(ENDPOINTS.settings.notifications, {
    method: 'PUT',
    body: input,
  });
}

export function useUpdateNotificationPreferences() {
  return useMutation<NotificationPreferences, NotificationPreferences>(
    updateNotificationPreferences
  );
}
