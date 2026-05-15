/**
 * Typed HTTP client with auth, retries, abort, and structured errors.
 *
 * In mock mode (VITE_USE_MOCKS=true) every domain module short-circuits to
 * the local mock store and never hits this client. Set VITE_USE_MOCKS=false
 * once endpoints are live.
 */

import type { ApiError } from './types';

// ─── Config ─────────────────────────────────────────────────────────────────

interface Env {
  apiBaseUrl: string;
  useMocks: boolean;
  mockLatencyMs: number;
}

function readEnv(): Env {
  // By default we keep mock mode on for demo environments. When the backend is
  // available, set `VITE_USE_MOCKS=false` (and optionally `VITE_API_BASE_URL`).
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  const useMocksRaw = (import.meta.env.VITE_USE_MOCKS as string | undefined) ?? 'true';
  const useMocks = useMocksRaw !== 'false';
  const mockLatencyMs = Number(
    (import.meta.env.VITE_MOCK_LATENCY_MS as string | undefined) ?? 350
  );
  return { apiBaseUrl, useMocks, mockLatencyMs };
}

export const env = readEnv();

// ─── Auth token storage ─────────────────────────────────────────────────────

const AUTH_TOKEN_KEY = 'clearpass.auth.token';

export function getAuthToken(): string | null {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    else sessionStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // sessionStorage unavailable — silently ignore.
  }
}

// ─── Errors ─────────────────────────────────────────────────────────────────

export class ApiClientError extends Error implements ApiError {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

// ─── Request ────────────────────────────────────────────────────────────────

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Number of retries on network/5xx errors. Default 1. */
  retries?: number;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const base = path.startsWith('http') ? path : `${env.apiBaseUrl}${path}`;
  if (!query) return base;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

async function parseError(res: Response): Promise<ApiClientError> {
  let body: unknown = undefined;
  try {
    body = await res.json();
  } catch {
    // not JSON
  }
  const code = (body as { code?: string })?.code ?? `HTTP_${res.status}`;
  const message = (body as { message?: string })?.message ?? res.statusText ?? 'Request failed';
  return new ApiClientError(res.status, code, message, body);
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.query);
  const token = getAuthToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const method = options.method ?? 'GET';
  const body = options.body !== undefined ? JSON.stringify(options.body) : undefined;
  const retries = options.retries ?? 1;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { method, headers, body, signal: options.signal });
      if (!res.ok) throw await parseError(res);
      const contentType = res.headers.get('content-type') ?? '';
      if (res.status === 204) return undefined as T;
      if (contentType.includes('application/json')) {
        return (await res.json()) as T;
      }
      // Fallback: for endpoints that return non-JSON, return text.
      return (await res.text()) as unknown as T;
    } catch (err) {
      if (isAbortError(err)) throw err;
      if (err instanceof ApiClientError && err.status < 500) throw err;
      if (attempt >= retries) throw err;
      await wait(backoffMs(attempt));
    }
  }

  // Unreachable, but TS doesn't know.
  throw new ApiClientError(500, 'UNKNOWN', 'Unknown request error');
}

function backoffMs(attempt: number): number {
  return Math.min(2000, 250 * 2 ** attempt);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Mock helper ────────────────────────────────────────────────────────────

/**
 * Wraps a value to look like an async API call. Domain modules use this to
 * simulate latency in mock mode so loading states render naturally.
 */
export async function mockResponse<T>(value: T, signal?: AbortSignal): Promise<T> {
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, env.mockLatencyMs);
    if (signal) {
      const onAbort = () => {
        clearTimeout(t);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      if (signal.aborted) onAbort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }
  });
  // Deep clone so callers can mutate without affecting the mock store.
  return structuredClone(value);
}
