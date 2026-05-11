/**
 * Authentication domain — login, register, logout, session management.
 *
 * Live mode swap: change `env.useMocks` to false (set VITE_USE_MOCKS=false).
 * No component changes required.
 */

import { env, mockResponse, request, setAuthToken } from './client';
import { ENDPOINTS } from './endpoints';
import type { AuthResponse, LoginInput, RegisterInput, User, Session } from './types';

// ─── Register ────────────────────────────────────────────────────────────────

export async function register(input: RegisterInput): Promise<AuthResponse> {
  if (env.useMocks) {
    const fakeUser: User = {
      id: `user-${crypto.randomUUID()}`,
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      role: input.role || 'contractor',
    };
    const fakeResponse: AuthResponse = {
      user: fakeUser,
      token: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token',
    };
    return mockResponse(fakeResponse);
  }
  const response = await request<{ success: boolean; data: AuthResponse }>(
    ENDPOINTS.auth.register,
    {
      method: 'POST',
      body: input,
    }
  );
  return response.data;
}

export function useRegister() {
  // Note: This would need a useMutation hook from useApi
  // For now, we'll implement it as a simple function
  return { mutate: register };
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<AuthResponse> {
  if (env.useMocks) {
    const fakeUser: User = {
      id: 'user-123',
      email: input.email,
      first_name: 'Test',
      last_name: 'User',
      role: 'contractor',
    };
    const fakeResponse: AuthResponse = {
      user: fakeUser,
      token: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token',
    };
    return mockResponse(fakeResponse);
  }
  const response = await request<{ success: boolean; data: AuthResponse }>(ENDPOINTS.auth.login, {
    method: 'POST',
    body: input,
  });
  // Auto-set the auth token on successful login
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
}

export function useLogin() {
  return { mutate: login };
}

// ─── Logout ─────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  if (env.useMocks) {
    setAuthToken(null);
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.auth.logout, { method: 'POST' });
  setAuthToken(null);
}

export function useLogout() {
  return { mutate: logout };
}

// ─── Logout All ─────────────────────────────────────────────────────────────

export async function logoutAll(): Promise<void> {
  if (env.useMocks) {
    setAuthToken(null);
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.auth.logoutAll, { method: 'POST' });
  setAuthToken(null);
}

// ─── Get Current User ───────────────────────────────────────────────────────

export async function getCurrentUser(signal?: AbortSignal): Promise<User> {
  if (env.useMocks) {
    const fakeUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'contractor',
    };
    return mockResponse(fakeUser, signal);
  }
  const response = await request<{ success: boolean; data: User }>(ENDPOINTS.auth.me, { signal });
  return response.data;
}

export function useCurrentUser() {
  // This would need a useApi hook implementation
  // For now, return a simple function
  return { getCurrentUser };
}

// ─── Refresh Token ─────────────────────────────────────────────────────────

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  if (env.useMocks) {
    const fakeResponse: AuthResponse = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'contractor',
      },
      token: 'new-fake-jwt-token',
      refreshToken: 'new-fake-refresh-token',
    };
    return mockResponse(fakeResponse);
  }
  const response = await request<{ success: boolean; data: AuthResponse }>(ENDPOINTS.auth.refresh, {
    method: 'POST',
    body: { refreshToken },
  });
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
}

// ─── Get Sessions ───────────────────────────────────────────────────────────

export async function getSessions(signal?: AbortSignal): Promise<Session[]> {
  if (env.useMocks) {
    return mockResponse([], signal);
  }
  const response = await request<{ success: boolean; data: Session[] }>(ENDPOINTS.auth.sessions, {
    signal,
  });
  return response.data;
}

export function useSessions() {
  return { getSessions };
}
