/**
 * Export utilities for generating CSV and PDF files
 */

export interface CertificateExportData {
  name: string;
  shortName: string;
  status: string;
  daysToExpiry?: number;
  expiryDate: string;
  certificateNumber?: string;
  isApiVerified: boolean;
  issuingAuthority?: string;
  issuedDate?: string;
}

export interface ComplianceReportExportData {
  companyName: string;
  rcNumber: string;
  score: number;
  procurementReady: boolean;
  totalCertificates: number;
  activeCertificates: number;
  expiringCount: number;
  expiredCount: number;
  generatedDate: string;
}

/**
 * Generate CSV from certificate data
 */
export function exportCertificatesToCSV(
  certificates: CertificateExportData[],
  filename: string = 'certificates-export.csv'
): void {
  const headers = [
    'Certificate Name',
    'Short Name',
    'Status',
    'Days to Expiry',
    'Expiry Date',
    'Certificate Number',
    'API Verified',
    'Issuing Authority',
    'Issued Date',
  ];

  const rows = certificates.map((cert) => [
    cert.name,
    cert.shortName,
    cert.status,
    cert.daysToExpiry ?? 'N/A',
    cert.expiryDate,
    cert.certificateNumber ?? 'N/A',
    cert.isApiVerified ? 'Yes' : 'No',
    cert.issuingAuthority ?? 'N/A',
    cert.issuedDate ?? 'N/A',
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadCSV(csvContent, filename);
}

/**
 * Generate CSV from compliance report data
 */
export function exportComplianceReportToCSV(
  report: ComplianceReportExportData,
  filename: string = 'compliance-report.csv'
): void {
  const headers = [
    'Company Name',
    'RC Number',
    'Compliance Score',
    'Procurement Ready',
    'Total Certificates',
    'Active Certificates',
    'Expiring Certificates',
    'Expired Certificates',
    'Report Generated Date',
  ];

  const row = [
    report.companyName,
    report.rcNumber,
    report.score.toString(),
    report.procurementReady ? 'Yes' : 'No',
    report.totalCertificates.toString(),
    report.activeCertificates.toString(),
    report.expiringCount.toString(),
    report.expiredCount.toString(),
    report.generatedDate,
  ];

  const csvContent = [headers.join(','), row.join(',')].join('\n');
  downloadCSV(csvContent, filename);
}

/**
 * Download CSV content as file
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Generate simple HTML for PDF export (can be used with browser print)
 */
export function generateCertificatePrintHTML(
  certificates: CertificateExportData[],
  companyName: string
): string {
  const today = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Certificate Report - ${companyName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #FF3000;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #FF3000;
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 5px 0 0 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .status-active {
      color: #1FC16B;
      font-weight: bold;
    }
    .status-expiring {
      color: #F59E0B;
      font-weight: bold;
    }
    .status-expired {
      color: #FF3000;
      font-weight: bold;
    }
    .status-pending {
      color: #6B7280;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    .verified {
      color: #1FC16B;
    }
    .not-verified {
      color: #FF3000;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Certificate Report</h1>
    <p><strong>${companyName}</strong></p>
    <p>Generated on ${today}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Certificate</th>
        <th>Status</th>
        <th>Expiry Date</th>
        <th>Certificate Number</th>
        <th>Verification</th>
        <th>Issuing Authority</th>
      </tr>
    </thead>
    <tbody>
      ${certificates.map((cert) => `
        <tr>
          <td><strong>${cert.name}</strong><br><small>${cert.shortName}</small></td>
          <td class="status-${cert.status.replace('-', '')}">${cert.status.replace('-', ' ').toUpperCase()}</td>
          <td>${cert.expiryDate}</td>
          <td>${cert.certificateNumber || 'N/A'}</td>
          <td class="${cert.isApiVerified ? 'verified' : 'not-verified'}">${cert.isApiVerified ? '✓ API Verified' : 'Manual Review'}</td>
          <td>${cert.issuingAuthority || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated by ClearPass - Nigeria's Federal Compliance Platform</p>
    <p>This document is for compliance verification purposes only.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Print certificate report (opens browser print dialog)
 */
export function printCertificateReport(
  certificates: CertificateExportData[],
  companyName: string
): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(generateCertificatePrintHTML(certificates, companyName));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

/**
 * Generate compliance score report HTML
 */
export function generateComplianceScoreHTML(
  report: ComplianceReportExportData,
  certificates: CertificateExportData[]
): string {
  const today = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Compliance Score Report - ${report.companyName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #FF3000;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #FF3000;
      margin: 0;
    }
    .score-section {
      background: linear-gradient(135deg, #FF3000 0%, #cc0000 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 30px;
    }
    .score-number {
      font-size: 72px;
      font-weight: bold;
      line-height: 1;
    }
    .score-label {
      font-size: 18px;
      opacity: 0.9;
    }
    .procurement-ready {
      background: ${report.procurementReady ? '#1FC16B' : '#FF3000'};
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      margin-top: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-number {
      font-size: 32px;
      font-weight: bold;
      color: #FF3000;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Compliance Score Report</h1>
    <p><strong>${report.companyName}</strong></p>
    <p>RC Number: ${report.rcNumber}</p>
    <p>Generated on ${today}</p>
  </div>

  <div class="score-section">
    <div class="score-number">${report.score}</div>
    <div class="score-label">Compliance Score / 100</div>
    <div class="procurement-ready">
      ${report.procurementReady ? '✓ PROCUREMENT READY' : '✗ INELIGIBLE TO BID'}
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-number">${report.totalCertificates}</div>
      <div class="stat-label">Total Certificates</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${report.activeCertificates}</div>
      <div class="stat-label">Active Certificates</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${report.expiringCount}</div>
      <div class="stat-label">Expiring Soon</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${report.expiredCount}</div>
      <div class="stat-label">Expired</div>
    </div>
  </div>

  <h2>Certificate Details</h2>
  <table>
    <thead>
      <tr>
        <th>Certificate</th>
        <th>Status</th>
        <th>Expiry Date</th>
        <th>Verification</th>
      </tr>
    </thead>
    <tbody>
      ${certificates.map((cert) => `
        <tr>
          <td><strong>${cert.name}</strong></td>
          <td>${cert.status.toUpperCase()}</td>
          <td>${cert.expiryDate}</td>
          <td>${cert.isApiVerified ? '✓ API Verified' : 'Manual Review'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated by ClearPass - Nigeria's Federal Compliance Platform</p>
    <p>This compliance score is calculated based on certificate coverage, freshness, and verification quality.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Print compliance score report
 */
export function printComplianceScoreReport(
  report: ComplianceReportExportData,
  certificates: CertificateExportData[]
): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(generateComplianceScoreHTML(report, certificates));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}