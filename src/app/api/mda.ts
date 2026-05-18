/**
 * MDA portal — vendor verification + prequalification queue.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockPrequalification, mockVendorVerifications } from './mocks';
import type { PrequalificationApplicant, VendorVerification } from './types';
import { useApi, useMutation } from './useApi';

// Deterministic synthetic company names for unknown RC numbers.
const SYNTHETIC_NAMES = [
  'Prestige Industrial Ltd', 'Goldbridge Nigeria Ltd', 'Continental Supplies Ltd',
  'Premier Services Co.', 'Nationwide Contractors', 'Heritage Tech Solutions',
  'Foresight Industries Ltd', 'Meridian Logistics Ltd', 'Summit Enterprises Ltd',
  'Pinnacle Resources Ltd', 'Landmark Trade Co.', 'Capital Works Ltd',
  'Vanguard Construction Ltd', 'Zenith Supply Chain Ltd', 'Frontier Engineering Co.',
];

function deterministicHash(s: string): number {
  return Array.from(s.toUpperCase()).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
}

function syntheticVerification(rcNumber: string): VendorVerification {
  const h = Math.abs(deterministicHash(rcNumber));
  const score = 15 + (h % 76); // 15–90
  const status: VendorVerification['status'] =
    score >= 75 ? 'procurement-ready' : score >= 50 ? 'attention-required' : 'ineligible';
  const companyName = SYNTHETIC_NAMES[h % SYNTHETIC_NAMES.length];

  const certStatuses = (['active', 'active', 'expiring', 'expired'] as const).map(
    (_, i) => (['active', 'active', 'expiring', 'expired', 'active', 'active'] as const)[(h + i) % 6]
  );
  const expiries = ['15 Jan 2027', '20 Aug 2026', '04 Jun 2026', '10 Mar 2026', '28 Nov 2026', '17 Feb 2027'];

  return {
    rcNumber: rcNumber.toUpperCase(),
    companyName,
    score,
    status,
    lastVerified: new Date().toLocaleString('en-NG'),
    certificates: ['NHIA', 'PCC', 'NSITF', 'FIRS', 'BPP', 'ITF'].map((name, i) => ({
      name,
      status: certStatuses[i] ?? 'active',
      expiryDate: expiries[(h + i) % expiries.length],
    })),
  };
}

export async function verifyVendor(query: string): Promise<VendorVerification> {
  const trimmedQuery = query.trim();
  if (env.useMocks) {
    const normalizedQuery = trimmedQuery.toUpperCase();
    const found = mockVendorVerifications.find(
      (v) =>
        v.rcNumber.toUpperCase() === normalizedQuery ||
        v.companyName.toUpperCase().includes(normalizedQuery)
    );
    if (!found) {
      const isRcFormat = /^RC\d{7,}$/i.test(trimmedQuery);
      // For RC-format queries: return a plausible deterministic result.
      // For name searches with no match: return a generic not-found response.
      const synthetic: VendorVerification = isRcFormat
        ? syntheticVerification(trimmedQuery)
        : {
            rcNumber: 'N/A',
            companyName: 'No matching vendor found',
            score: 0,
            status: 'ineligible',
            lastVerified: new Date().toLocaleString('en-NG'),
            certificates: [],
          };
      return mockResponse(synthetic);
    }
    return mockResponse(found);
  }
  return request<VendorVerification>(ENDPOINTS.mda.verify(trimmedQuery));
}

export function useVerifyVendor() {
  return useMutation<string, VendorVerification>(verifyVendor);
}

export function listPrequalification(signal?: AbortSignal): Promise<PrequalificationApplicant[]> {
  if (env.useMocks) return mockResponse(mockPrequalification, signal);
  return request<PrequalificationApplicant[]>(ENDPOINTS.mda.prequalification, {
    signal,
  });
}

export function usePrequalification() {
  return useApi<PrequalificationApplicant[]>((signal) => listPrequalification(signal));
}

export async function approveApplicant(id: string): Promise<void> {
  if (env.useMocks) {
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.mda.approve(id), { method: 'POST' });
}

export function useApproveApplicant() {
  return useMutation<string, void>(approveApplicant);
}

export async function rejectApplicant(input: { id: string; reason?: string }): Promise<void> {
  if (env.useMocks) {
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.mda.reject(input.id), {
    method: 'POST',
    body: { reason: input.reason },
  });
}

export function useRejectApplicant() {
  return useMutation<{ id: string; reason?: string }, void>(rejectApplicant);
}
