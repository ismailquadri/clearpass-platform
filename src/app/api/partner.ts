/**
 * Partner portal — managed clients + revenue / compliance analytics.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mockPartnerAnalytics, mockPartnerClients, mockClientCertificates } from './mocks';
import type { PartnerAnalytics, PartnerClient, CompliancePartnerLink, Permission, ClientCertificate } from './types';
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

// Compliance Partner Link management
export function getClientPermissions(clientId: string, signal?: AbortSignal): Promise<CompliancePartnerLink[]> {
  if (env.useMocks) {
    return mockResponse([
      {
        id: '1',
        partnerUserId: 'partner-1',
        clientCompanyId: clientId,
        permissions: ['certificates.view', 'certificates.edit', 'reports.generate'],
        linkedAt: new Date().toISOString(),
        linkedByCompanyUserId: 'user-1',
        status: 'active',
        createdAt: new Date().toISOString(),
      }
    ], signal);
  }
  return request<CompliancePartnerLink[]>(`${ENDPOINTS.partner.permissions}/${clientId}`, { signal });
}

export function useClientPermissions(clientId: string) {
  return useApi<CompliancePartnerLink[]>((signal) => getClientPermissions(clientId, signal));
}

export function updateClientPermissions(
  clientId: string,
  permissions: Permission[],
  signal?: AbortSignal
): Promise<CompliancePartnerLink> {
  if (env.useMocks) {
    return mockResponse({
      id: '1',
      partnerUserId: 'partner-1',
      clientCompanyId: clientId,
      permissions,
      linkedAt: new Date().toISOString(),
      linkedByCompanyUserId: 'user-1',
      status: 'active',
      createdAt: new Date().toISOString(),
    }, signal);
  }
  return request<CompliancePartnerLink>(
    `${ENDPOINTS.partner.permissions}/${clientId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ permissions }),
      signal,
    }
  );
}

export function revokeClientAccess(clientId: string, signal?: AbortSignal): Promise<CompliancePartnerLink> {
  if (env.useMocks) {
    return mockResponse({
      id: '1',
      partnerUserId: 'partner-1',
      clientCompanyId: clientId,
      permissions: [],
      linkedAt: new Date().toISOString(),
      linkedByCompanyUserId: 'user-1',
      status: 'revoked',
      revokedAt: new Date().toISOString(),
      revokedBy: 'user-1',
      createdAt: new Date().toISOString(),
    }, signal);
  }
  return request<CompliancePartnerLink>(
    `${ENDPOINTS.partner.permissions}/${clientId}/revoke`,
    {
      method: 'POST',
      signal,
    }
  );
}

export function restoreClientAccess(clientId: string, signal?: AbortSignal): Promise<CompliancePartnerLink> {
  if (env.useMocks) {
    return mockResponse({
      id: '1',
      partnerUserId: 'partner-1',
      clientCompanyId: clientId,
      permissions: ['certificates.view', 'certificates.edit'],
      linkedAt: new Date().toISOString(),
      linkedByCompanyUserId: 'user-1',
      status: 'active',
      createdAt: new Date().toISOString(),
    }, signal);
  }
  return request<CompliancePartnerLink>(
    `${ENDPOINTS.partner.permissions}/${clientId}/restore`,
    {
      method: 'POST',
      signal,
    }
  );
}

export function getClientCertificates(clientId: string, signal?: AbortSignal): Promise<ClientCertificate[]> {
  if (env.useMocks) {
    const clientCerts = mockClientCertificates[clientId] || [];
    return mockResponse(clientCerts, signal);
  }
  return request<ClientCertificate[]>(`${ENDPOINTS.partner.clients}/${clientId}/certificates`, { signal });
}

export function useClientCertificates(clientId: string) {
  return useApi<ClientCertificate[]>((signal) => getClientCertificates(clientId, signal));
}
