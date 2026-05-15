/**
 * Reports — company-facing compliance exports.
 */

import { env, mockResponse, request } from './client';
import { ENDPOINTS } from './endpoints';
import { useApi, useMutation } from './useApi';

export type ReportType = 'compliance' | 'audit' | 'pre_qual';

export interface ReportListItem {
  id: string;
  report_type: ReportType;
  pdf_url: string;
  generated_at: string;
  valid_until?: string;
  compliance_score?: number;
}

export interface GenerateReportInput {
  report_type: ReportType;
}

export interface GenerateReportOutput {
  id: string;
  report_type: ReportType;
  pdf_url: string;
  generated_at: string;
  valid_until: string;
}

export async function listReports(signal?: AbortSignal): Promise<ReportListItem[]> {
  if (env.useMocks) return mockResponse([], signal);
  const res = await request<{ success: true; data: ReportListItem[] }>(ENDPOINTS.reports.list, {
    signal,
  });
  return res.data;
}

export function useReports() {
  return useApi<ReportListItem[]>((signal) => listReports(signal));
}

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  if (env.useMocks) {
    const now = new Date();
    return mockResponse({
      id: `mock-${now.getTime()}`,
      report_type: input.report_type,
      pdf_url: '#',
      generated_at: now.toISOString(),
      valid_until: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  const res = await request<{ success: true; data: GenerateReportOutput }>(
    ENDPOINTS.reports.generate,
    {
      method: 'POST',
      body: input,
    }
  );
  return res.data;
}

export function useGenerateReport() {
  return useMutation<GenerateReportInput, GenerateReportOutput>(generateReport);
}

export function reportDownloadUrl(id: string): string {
  return `${env.apiBaseUrl}${ENDPOINTS.reports.download(id)}`;
}

