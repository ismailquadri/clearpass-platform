import { db } from '../config/database';

export interface VerifyCertificateInput {
  certType: string;
  certNumber: string;
  companyName?: string;
}

export interface VerificationResult {
  valid: boolean;
  certNumber: string;
  certType: string;
  issuedDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: 'active' | 'expired' | 'revoked';
  apiResponse: any;
}

export class GovernmentApiService {
  // Mock government API responses
  private mockDatabase: Map<string, VerificationResult> = new Map([
    ['NHIA/2024/001234', {
      valid: true,
      certNumber: 'NHIA/2024/001234',
      certType: 'nhia',
      issuedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      issuingAuthority: 'National Health Insurance Authority',
      status: 'active',
      apiResponse: { source: 'NHIA API', verifiedAt: new Date().toISOString() },
    }],
    ['PCC/2024/005678', {
      valid: true,
      certNumber: 'PCC/2024/005678',
      certType: 'pcc',
      issuedDate: '2024-02-20',
      expiryDate: '2025-02-20',
      issuingAuthority: 'Nigeria Police Force',
      status: 'active',
      apiResponse: { source: 'NPF API', verifiedAt: new Date().toISOString() },
    }],
    ['NSITF/2024/009012', {
      valid: true,
      certNumber: 'NSITF/2024/009012',
      certType: 'nsitf',
      issuedDate: '2024-03-10',
      expiryDate: '2025-03-10',
      issuingAuthority: 'Nigeria Social Insurance Trust Fund',
      status: 'active',
      apiResponse: { source: 'NSITF API', verifiedAt: new Date().toISOString() },
    }],
    ['FIRS/2024/013456', {
      valid: true,
      certNumber: 'FIRS/2024/013456',
      certType: 'firs',
      issuedDate: '2024-04-05',
      expiryDate: '2025-04-05',
      issuingAuthority: 'Federal Inland Revenue Service',
      status: 'active',
      apiResponse: { source: 'FIRS API', verifiedAt: new Date().toISOString() },
    }],
  ]);

  async verifyCertificate(input: VerifyCertificateInput): Promise<VerificationResult> {
    // Simulate API call delay
    await this.simulateApiDelay(500, 2000);

    // Check mock database
    const mockResult = this.mockDatabase.get(input.certNumber);

    if (mockResult) {
      // Log the API call
      await this.logApiCall(input.certType, 'verification', input, mockResult, true);

      return mockResult;
    }

    // For certificates not in mock database, return a mock verification
    const result: VerificationResult = {
      valid: true,
      certNumber: input.certNumber,
      certType: input.certType,
      issuedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuingAuthority: this.getIssuingAuthority(input.certType),
      status: 'active',
      apiResponse: { source: `${input.certType.toUpperCase()} API`, verifiedAt: new Date().toISOString() },
    };

    // Log the API call
    await this.logApiCall(input.certType, 'verification', input, result, true);

    return result;
  }

  async verifyCompany(rcNumber: string): Promise<any> {
    // Simulate API call delay
    await this.simulateApiDelay(500, 2000);

    // Mock company verification
    return {
      valid: true,
      rcNumber,
      companyName: 'Mock Company Ltd',
      registrationDate: '2020-01-15',
      status: 'active',
      apiResponse: { source: 'CAC API', verifiedAt: new Date().toISOString() },
    };
  }

  async batchVerifyCertificates(certificates: Array<{ certType: string; certNumber: string }>): Promise<VerificationResult[]> {
    const results: VerificationResult[] = [];

    for (const cert of certificates) {
      try {
        const result = await this.verifyCertificate(cert);
        results.push(result);
      } catch {
        results.push({
          valid: false,
          certNumber: cert.certNumber,
          certType: cert.certType,
          issuedDate: '',
          expiryDate: '',
          issuingAuthority: '',
          status: 'revoked',
          apiResponse: { error: 'Verification failed' },
        });
      }
    }

    return results;
  }

  private getIssuingAuthority(certType: string): string {
    const authorities: Record<string, string> = {
      nhia: 'National Health Insurance Authority',
      pcc: 'Nigeria Police Force',
      nsitf: 'Nigeria Social Insurance Trust Fund',
      firs: 'Federal Inland Revenue Service',
      bpp: 'Bureau of Public Procurement',
      itf: 'Industrial Training Fund',
    };

    return authorities[certType] || 'Unknown Authority';
  }

  private async simulateApiDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async logApiCall(
    apiEndpoint: string,
    requestType: string,
    requestPayload: any,
    response: any,
    success: boolean
  ): Promise<void> {
    await db('government_api_logs').insert({
      api_endpoint: apiEndpoint,
      request_type: requestType,
      request_payload: requestPayload as Record<string, unknown>,
      response_status: success ? 200 : 500,
      response_body: response as Record<string, unknown>,
      processing_time_ms: Math.floor(Math.random() * 1000) + 500,
      success,
    });
  }

  // Add mock certificate to database for testing
  addMockCertificate(certNumber: string, result: VerificationResult): void {
    this.mockDatabase.set(certNumber, result);
  }
}

export const governmentApiService = new GovernmentApiService();