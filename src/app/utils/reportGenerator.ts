interface CertRow {
  name: string;
  status: string;
  expiryDate: string;
}

interface ReportData {
  companyName: string;
  rcNumber: string;
  score: number;
  status: string;
  certificates: CertRow[];
  lastVerified: string;
  generatedBy?: string;
  reportId?: string;
  liveUrl?: string;
}

function statusLabel(s: string) {
  switch (s) {
    case 'procurement-ready': return 'PROCUREMENT READY';
    case 'attention-required': return 'ATTENTION REQUIRED';
    case 'ineligible': return 'INELIGIBLE TO BID';
    default: return s.toUpperCase().replace(/-/g, ' ');
  }
}

function statusColor(s: string) {
  switch (s) {
    case 'procurement-ready': return '#057a46';
    case 'attention-required': return '#d97706';
    case 'ineligible': return '#dc2626';
    default: return '#6b7280';
  }
}

function certStatusColor(s: string) {
  switch (s) {
    case 'active': return '#057a46';
    case 'expiring': return '#d97706';
    case 'expired': return '#dc2626';
    default: return '#6b7280';
  }
}

function certStatusLabel(s: string) {
  switch (s) {
    case 'active': return 'Active';
    case 'expiring': return 'Expiring Soon';
    case 'expired': return 'Expired';
    default: return s;
  }
}

export function openVerificationReport(data: ReportData) {
  const now = new Date();
  const generatedAt = now.toLocaleString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
  });
  const reportRef = data.reportId ?? `CP-${Date.now().toString(36).toUpperCase()}`;
  const sColor = statusColor(data.status);
  const sLabel = statusLabel(data.status);

  const certRows = data.certificates.map(c => {
    const cColor = certStatusColor(c.status);
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${c.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">
          <span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:600;background:${cColor}18;color:${cColor}">
            ${certStatusLabel(c.status).toUpperCase()}
          </span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">${c.expiryDate || '—'}</td>
      </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>ClearPass Verification Report — ${data.rcNumber}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'SuisseIntl','Segoe UI',Arial,sans-serif;color:#111;background:#f9fafb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    @page{size:A4;margin:20mm}
    @media print{body{background:white}.no-print{display:none!important}}
    .page{max-width:800px;margin:0 auto;background:white;min-height:100vh;padding:40px}
    .header{display:flex;align-items:center;justify-content:space-between;padding-bottom:24px;border-bottom:3px solid #057a46;margin-bottom:32px}
    .header-left{display:flex;align-items:center;gap:16px}
    .logo-block{display:flex;align-items:center;gap:10px}
    .logo-cp{font-size:22px;font-weight:900;color:#111;letter-spacing:-0.5px}
    .logo-cp span{color:#057a46}
    .divider{width:1px;height:36px;background:#d1d5db}
    .logo-nhia{font-size:11px;font-weight:700;color:#0a3d1f;text-transform:uppercase;line-height:1.3;max-width:100px}
    .report-meta{text-align:right;font-size:12px;color:#6b7280;line-height:1.8}
    .report-meta strong{color:#111;font-size:13px}
    .section{margin-bottom:28px}
    .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb}
    .company-card{background:#f0fcf6;border:1px solid #c3f1d7;border-radius:10px;padding:20px 24px;display:flex;justify-content:space-between;align-items:flex-start}
    .company-name{font-size:22px;font-weight:700;color:#111;margin-bottom:4px}
    .company-rc{font-size:13px;color:#6b7280}
    .score-block{text-align:right}
    .score-num{font-size:42px;font-weight:800;line-height:1;color:${sColor}}
    .score-denom{font-size:16px;font-weight:400;color:#9ca3af}
    .score-label{font-size:11px;color:#6b7280;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px}
    .status-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.3px;background:${sColor}18;color:${sColor};margin-top:10px}
    .cert-table{width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
    .cert-table th{padding:10px 12px;text-align:left;background:#f9fafb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;border-bottom:1px solid #e5e7eb}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .info-item{padding:12px 16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb}
    .info-label{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
    .info-value{font-size:14px;font-weight:600;color:#111}
    .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center}
    .footer-legal{font-size:11px;color:#9ca3af;max-width:420px;line-height:1.5}
    .footer-stamp{background:#057a46;color:white;padding:8px 16px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:0.5px}
    .watermark{position:fixed;bottom:30px;right:30px;font-size:11px;color:#d1d5db;transform:rotate(-15deg);pointer-events:none}
    .print-btn{position:fixed;top:20px;right:20px;background:#057a46;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(5,122,70,.3)}
    .print-btn:hover{background:#04663b}
    .live-url{font-size:11px;color:#057a46;word-break:break-all;margin-top:6px}
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></svg>
    Save as PDF
  </button>

  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="logo-block">
          <span class="logo-cp">Clear<span>Pass</span>®</span>
        </div>
        <div class="divider"></div>
        <div class="logo-nhia">National Health Insurance Authority</div>
      </div>
      <div class="report-meta">
        <strong>Vendor Compliance Verification Report</strong><br>
        Reference: ${reportRef}<br>
        Generated: ${generatedAt}<br>
        ${data.generatedBy ? `Officer: ${data.generatedBy}` : ''}
      </div>
    </div>

    <!-- Company summary -->
    <div class="section">
      <div class="section-title">Vendor Summary</div>
      <div class="company-card">
        <div>
          <div class="company-name">${data.companyName}</div>
          <div class="company-rc">RC Number: ${data.rcNumber}</div>
          <div class="status-badge">${sLabel}</div>
        </div>
        <div class="score-block">
          <div class="score-num">${data.score}<span class="score-denom">/100</span></div>
          <div class="score-label">Compliance Score</div>
        </div>
      </div>
    </div>

    <!-- Verification info -->
    <div class="section">
      <div class="section-title">Verification Details</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Last Verified</div>
          <div class="info-value">${data.lastVerified}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Verification Method</div>
          <div class="info-value">Real-Time API Check</div>
        </div>
        <div class="info-item">
          <div class="info-label">Issuing Platform</div>
          <div class="info-value">ClearPass — clearpass.com.ng</div>
        </div>
        <div class="info-item">
          <div class="info-label">Procurement Eligibility</div>
          <div class="info-value" style="color:${sColor}">${data.status === 'procurement-ready' ? 'Eligible to Bid' : data.status === 'ineligible' ? 'Not Eligible to Bid' : 'Review Required'}</div>
        </div>
      </div>
      ${data.liveUrl ? `<div class="live-url">Live verification: ${data.liveUrl}</div>` : ''}
    </div>

    <!-- Certificates -->
    ${data.certificates.length > 0 ? `
    <div class="section">
      <div class="section-title">Certificate Status</div>
      <table class="cert-table">
        <thead>
          <tr>
            <th>Certificate</th>
            <th>Status</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>${certRows}</tbody>
      </table>
    </div>` : ''}

    <!-- Footer -->
    <div class="footer">
      <div class="footer-legal">
        This report was generated by ClearPass, the official private-sector compliance verification platform operating under mandate from the National Health Insurance Authority (NHIA). All data is sourced in real-time from registered government API endpoints. This document is admissible as evidence of compliance verification in federal procurement proceedings.
      </div>
      <div class="footer-stamp">NHIA VERIFIED</div>
    </div>
  </div>

  <script>
    // Auto-focus the print button for keyboard users
    document.querySelector('.print-btn')?.focus();
  </script>
</body>
</html>`;

  const win = window.open('', '_blank', 'noopener,noreferrer,width=900,height=800');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
