/**
 * MDA portal — vendor verification + prequalification queue.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockPrequalification, mockVendorVerifications } from './mocks';
import type { PrequalificationApplicant, VendorVerification } from './types';
import { useApi, useMutation } from './useApi';

export async function verifyVendor(
  rcNumber: string
): Promise<VendorVerification> {
  if (env.useMocks) {
    const found = mockVendorVerifications.find(
      (v) => v.rcNumber.toUpperCase() === rcNumber.toUpperCase()
    );
    if (!found) {
      // Generate a synthetic "no record" response.
      const synthetic: VendorVerification = {
        rcNumber: rcNumber.toUpperCase(),
        companyName: 'Unknown Vendor',
        score: 0,
        status: 'ineligible',
        lastVerified: new Date().toLocaleString('en-NG'),
        certificates: [],
      };
      return mockResponse(synthetic);
    }
    return mockResponse(found);
  }
  return request<VendorVerification>(ENDPOINTS.mda.verify(rcNumber));
}

export function useVerifyVendor() {
  return useMutation<string, VendorVerification>(verifyVendor);
}

export function listPrequalification(
  signal?: AbortSignal
): Promise<PrequalificationApplicant[]> {
  if (env.useMocks) return mockResponse(mockPrequalification, signal);
  return request<PrequalificationApplicant[]>(ENDPOINTS.mda.prequalification, {
    signal,
  });
}

export function usePrequalification() {
  return useApi<PrequalificationApplicant[]>((signal) =>
    listPrequalification(signal)
  );
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

export async function rejectApplicant(input: {
  id: string;
  reason?: string;
}): Promise<void> {
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
