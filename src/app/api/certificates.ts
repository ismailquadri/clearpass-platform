/**
 * Certificates domain — list, detail, upload, delete, export.
 *
 * Live mode swap: change `env.useMocks` to false (set VITE_USE_MOCKS=false).
 * No component changes required.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockCertificates } from './mocks';
import type { Certificate, CertificateUploadInput } from './types';
import { useApi, useMutation } from './useApi';

// ─── List ───────────────────────────────────────────────────────────────────

export function listCertificates(signal?: AbortSignal): Promise<Certificate[]> {
  if (env.useMocks) return mockResponse(mockCertificates, signal);
  return request<Certificate[]>(ENDPOINTS.certificates.list, { signal });
}

export function useCertificates() {
  return useApi<Certificate[]>((signal) => listCertificates(signal));
}

// ─── Detail ─────────────────────────────────────────────────────────────────

export function getCertificate(
  id: string,
  signal?: AbortSignal
): Promise<Certificate> {
  if (env.useMocks) {
    const found = mockCertificates.find((c) => c.id === id);
    if (!found) {
      return Promise.reject(new Error(`Certificate ${id} not found`));
    }
    return mockResponse(found, signal);
  }
  return request<Certificate>(ENDPOINTS.certificates.detail(id), { signal });
}

export function useCertificate(id: string | undefined) {
  return useApi<Certificate>(
    (signal) => {
      if (!id) return Promise.reject(new Error('Missing certificate id'));
      return getCertificate(id, signal);
    },
    { enabled: !!id, deps: [id] }
  );
}

// ─── Upload ─────────────────────────────────────────────────────────────────

export async function uploadCertificate(
  input: CertificateUploadInput
): Promise<Certificate> {
  if (env.useMocks) {
    const fake: Certificate = {
      id: `cert-${crypto.randomUUID()}`,
      name: input.shortName,
      shortName: input.shortName,
      status: 'pending',
      expiryDate: input.expiryDate,
      issuedDate: input.issuedDate,
      certificateNumber: input.certificateNumber,
      isApiVerified: false,
    };
    return mockResponse(fake);
  }
  const fd = new FormData();
  fd.append('shortName', input.shortName);
  fd.append('certificateNumber', input.certificateNumber);
  fd.append('issuedDate', input.issuedDate);
  fd.append('expiryDate', input.expiryDate);
  fd.append('file', input.file);
  return request<Certificate>(ENDPOINTS.certificates.upload, {
    method: 'POST',
    body: fd,
  });
}

export function useUploadCertificate() {
  return useMutation<CertificateUploadInput, Certificate>(uploadCertificate);
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function deleteCertificate(id: string): Promise<void> {
  if (env.useMocks) {
    await mockResponse(undefined);
    return;
  }
  await request<void>(ENDPOINTS.certificates.delete(id), { method: 'DELETE' });
}

export function useDeleteCertificate() {
  return useMutation<string, void>(deleteCertificate);
}
