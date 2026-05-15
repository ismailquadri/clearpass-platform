/**
 * MDA verification reports (PDF + live verification URL token).
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { useApi, useMutation } from './useApi';

export type MDAVerificationReportType = 'verification';
const MOCK_MDA_REPORTS_KEY = 'clearpass.mda.mockReports.v1';

export interface MDAVerificationReport {
  id: string;
  report_type: MDAVerificationReportType;
  rc_number: string;
  company_name: string;
  generated_at: string;
  generated_by: string;
  pdf_url: string;
  live_url: string;
  token: string;
  score?: number;
  status?: 'procurement-ready' | 'attention-required' | 'ineligible';
}

export interface GenerateMDAVerificationReportInput {
  rc_number: string;
}

function readMockReports(): MDAVerificationReport[] {
  try {
    return JSON.parse(localStorage.getItem(MOCK_MDA_REPORTS_KEY) || '[]') as MDAVerificationReport[];
  } catch {
    return [];
  }
}

function writeMockReports(reports: MDAVerificationReport[]) {
  try {
    localStorage.setItem(MOCK_MDA_REPORTS_KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
}

export async function listMDAVerificationReports(
  signal?: AbortSignal
): Promise<MDAVerificationReport[]> {
  if (env.useMocks) return mockResponse(readMockReports(), signal);
  const res = await request<{ success: true; data: MDAVerificationReport[] }>(
    ENDPOINTS.mdaReports.list,
    { signal }
  );
  return res.data;
}

export function useMDAVerificationReports() {
  return useApi<MDAVerificationReport[]>((signal) => listMDAVerificationReports(signal));
}

export async function generateMDAVerificationReport(
  input: GenerateMDAVerificationReportInput
): Promise<MDAVerificationReport> {
  if (env.useMocks) {
    const now = new Date();
    const token = `mock_${now.getTime()}`;
    const report: MDAVerificationReport = {
      id: `mock-${now.getTime()}`,
      report_type: 'verification',
      rc_number: input.rc_number.toUpperCase(),
      company_name: input.rc_number.toUpperCase() === 'RC1234567' ? 'TechVentures Nigeria Ltd' : 'Unknown Vendor',
      generated_at: now.toISOString(),
      generated_by: 'Engr. Bello Adamu',
      pdf_url: '#',
      token,
      live_url: `${location.origin}/mda/verify?token=${encodeURIComponent(token)}`,
      score: input.rc_number.toUpperCase() === 'RC1234567' ? 92 : 0,
      status: input.rc_number.toUpperCase() === 'RC1234567' ? 'procurement-ready' : 'ineligible',
    };
    writeMockReports([report, ...readMockReports()]);
    return mockResponse(report);
  }
  const res = await request<{ success: true; data: MDAVerificationReport }>(
    ENDPOINTS.mdaReports.generateVerification,
    {
      method: 'POST',
      body: input,
    }
  );
  return res.data;
}

export function useGenerateMDAVerificationReport() {
  return useMutation<GenerateMDAVerificationReportInput, MDAVerificationReport>(
    generateMDAVerificationReport
  );
}

export function mdaReportDownloadUrl(id: string): string {
  return `${env.apiBaseUrl}${ENDPOINTS.mdaReports.download(id)}`;
}
