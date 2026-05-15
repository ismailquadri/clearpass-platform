import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Step {
  title: string;
  description: string;
}

interface CertGuide {
  id: string;
  name: string;
  shortName: string;
  issuingAuthority: string;
  portalUrl: string;
  processingTime: string;
  typicalFee: string;
  renewalPeriod: string;
  requiredDocuments: string[];
  steps: Step[];
  tips: string[];
  applicability: string;
}

const GUIDES: CertGuide[] = [
  {
    id: 'nhia',
    name: 'NHIA Health Insurance Certificate',
    shortName: 'NHIA',
    issuingAuthority: 'National Health Insurance Authority',
    portalUrl: 'https://nhia.gov.ng',
    processingTime: '5–14 business days',
    typicalFee: '₦6,500–₦15,000 per employee per month',
    renewalPeriod: 'Annual',
    requiredDocuments: [
      'CAC Certificate',
      'Staff list with employee details',
      'Company bank statement (3 months)',
      'HMO selection letter',
      'Proof of contribution payment',
    ],
    steps: [
      {
        title: 'Select a licensed HMO',
        description:
          'Choose from the NHIA-licensed HMO directory. Use ClearPass to filter by state and employee range.',
      },
      {
        title: 'Submit company details to HMO',
        description:
          'Provide company name, RC number, employee list, and sector. ClearPass pre-fills this for you.',
      },
      {
        title: 'Pay first premium',
        description: "Complete payment of the first month's premium. Payment methods vary by HMO.",
      },
      {
        title: 'HMO processes enrollment',
        description:
          'The HMO submits enrollment data to NHIA. This typically takes 3–7 business days.',
      },
      {
        title: 'Receive NHIA certificate',
        description:
          'NHIA issues your certificate once enrollment is confirmed. Upload to ClearPass immediately.',
      },
    ],
    tips: [
      'Start 30 days before any tender deadline — NHIA processing can take 2 weeks',
      'NHIA certificates are company-wide, not per-employee',
      'The September 2025 presidential directive makes this the highest priority certificate',
    ],
    applicability: 'Mandatory for all companies regardless of size or sector',
  },
  {
    id: 'pcc',
    name: 'Pension Clearance Certificate (PCC)',
    shortName: 'PCC',
    issuingAuthority: 'National Pension Commission (PenCom)',
    portalUrl: 'https://pencom.gov.ng',
    processingTime: '1–5 business days (auto-generated if contributions are current)',
    typicalFee: '₦0 — free if contributions are up to date',
    renewalPeriod: 'Annual (March)',
    requiredDocuments: [
      'PFA (Pension Fund Administrator) account details',
      'Proof of pension remittances for current year',
      'Employee RSA PINs',
    ],
    steps: [
      {
        title: 'Ensure pension contributions are current',
        description:
          'All employee pension contributions must be remitted to their respective PFAs. Check with your Finance/HR team.',
      },
      {
        title: 'Log into PenCom employer portal',
        description:
          'Access the PenCom employer self-service portal using your registered employer code.',
      },
      {
        title: 'Request PCC',
        description:
          'Navigate to "Generate PCC" and submit. PenCom cross-checks your contributions automatically.',
      },
      {
        title: 'Download certificate',
        description:
          'If contributions are current, the PCC is generated instantly. If not, clear outstanding remittances first.',
      },
    ],
    tips: [
      'PenCom validates directly via API — ClearPass can auto-verify your PCC',
      'Outstanding pension arrears must be fully cleared before PCC is issued',
      'The annual PCC window opens in March for the current tax year',
    ],
    applicability: 'Mandatory for all companies with employees',
  },
  {
    id: 'nsitf',
    name: 'NSITF Certificate',
    shortName: 'NSITF',
    issuingAuthority: 'Nigeria Social Insurance Trust Fund',
    portalUrl: 'https://nsitf.gov.ng',
    processingTime: '3–10 business days',
    typicalFee: '1% of annual employee payroll',
    renewalPeriod: 'Annual (January)',
    requiredDocuments: [
      'CAC Certificate',
      'Company profile',
      'Staff list with salaries',
      'Prior year NSITF payment receipt',
      'Bank statement showing payroll',
    ],
    steps: [
      {
        title: 'Register on NSITF portal',
        description:
          'Create an employer account at the NSITF online portal if not already registered.',
      },
      {
        title: 'Submit annual assessment',
        description: 'Declare your total annual payroll. NSITF calculates the 1% contribution due.',
      },
      {
        title: 'Pay assessment',
        description: 'Payment via Remita or bank transfer to designated NSITF account.',
      },
      {
        title: 'Upload payment evidence',
        description: 'Submit teller or Remita receipt through the portal.',
      },
      {
        title: 'Certificate issued',
        description:
          'NSITF verifies payment and issues your compliance certificate within 3–5 business days.',
      },
    ],
    tips: [
      'Pay immediately at the start of each year — NSITF is one of the most common causes of pre-qualification failure',
      'Keep payment receipts — NSITF portal sometimes has delays acknowledging payment',
    ],
    applicability: 'Mandatory for all companies regardless of size',
  },
  {
    id: 'itf',
    name: 'Industrial Training Fund Certificate',
    shortName: 'ITF',
    issuingAuthority: 'Industrial Training Fund',
    portalUrl: 'https://itf.gov.ng',
    processingTime: '5–15 business days',
    typicalFee: '1% of annual payroll (companies with 11+ employees)',
    renewalPeriod: 'Annual',
    requiredDocuments: [
      'CAC Certificate',
      'Staff list with designations',
      'Annual payroll schedule',
      'Bank statement',
      'Previous ITF receipt (for renewals)',
    ],
    steps: [
      {
        title: 'Register on ITF employer portal',
        description:
          'Create account at the ITF online portal using your RC number and company details.',
      },
      {
        title: 'Submit annual levy return',
        description: 'Declare total staff count and payroll. ITF calculates 1% training levy.',
      },
      {
        title: 'Pay levy via Remita',
        description: 'Pay the calculated levy amount through Remita to ITF designated account.',
      },
      { title: 'Submit payment evidence', description: 'Upload Remita receipt on the portal.' },
      {
        title: 'Certificate issued',
        description: 'ITF issues certificate after verifying payment.',
      },
    ],
    tips: [
      'Companies with fewer than 11 employees are exempt — confirm your employee count with HR before applying',
      'ITF levy is calculated on gross payroll including allowances',
    ],
    applicability: 'Mandatory for companies with 11 or more employees',
  },
  {
    id: 'firs_tin',
    name: 'FIRS Tax Identification Number & Tax Clearance',
    shortName: 'FIRS TIN',
    issuingAuthority: 'Federal Inland Revenue Service',
    portalUrl: 'https://taxpromax.firs.gov.ng',
    processingTime: 'TIN: Instant. Tax Clearance: 5–15 business days',
    typicalFee: '₦0 for TIN registration. Tax Clearance: free if taxes are current',
    renewalPeriod: 'Annual Tax Clearance (filed within 3 months of year-end)',
    requiredDocuments: [
      'CAC Certificate of Incorporation',
      'MEMART (Memorandum and Articles of Association)',
      'Board resolution',
      'Audited accounts (prior 3 years)',
      'Evidence of VAT filing',
    ],
    steps: [
      {
        title: 'Obtain TIN via TaxProMax',
        description:
          "If you don't have a TIN, register on the FIRS TaxProMax portal. Instant for new registrations.",
      },
      {
        title: 'File annual tax returns',
        description:
          'File Company Income Tax (CIT) returns within 6 months of financial year-end. Use TaxProMax.',
      },
      {
        title: 'Resolve any outstanding liabilities',
        description:
          'All outstanding tax liabilities, penalties, and interest must be cleared before Tax Clearance is issued.',
      },
      {
        title: 'Apply for Tax Clearance Certificate',
        description:
          'Apply through TaxProMax or your nearest FIRS office. Provide 3 years of audited accounts.',
      },
      {
        title: 'Collect certificate',
        description:
          'FIRS issues Tax Clearance Certificate covering the 3 most recent assessment years.',
      },
    ],
    tips: [
      'File taxes on time every year — late filing penalties make clearance harder',
      'Your TIN and Tax Clearance are two separate documents',
      'FIRS TIN can be verified via the FIRS API — ClearPass auto-validates this',
    ],
    applicability: 'Mandatory for all registered companies',
  },
  {
    id: 'bpp',
    name: 'BPP Interim Registration Report',
    shortName: 'BPP',
    issuingAuthority: 'Bureau of Public Procurement',
    portalUrl: 'https://procure.bpp.gov.ng',
    processingTime: '3–10 business days',
    typicalFee: '₦20,000–₦50,000 depending on company tier',
    renewalPeriod: 'Annual',
    requiredDocuments: [
      'CAC Certificate',
      'FIRS TIN Certificate',
      'NSITF Certificate',
      'PCC Certificate',
      'Company profile and brochure',
      'Evidence of past contracts',
      'Audited accounts (3 years)',
    ],
    steps: [
      {
        title: 'Gather prerequisites',
        description:
          'BPP registration requires all other certificates to be current first. Complete NHIA, PCC, NSITF, FIRS TIN, and ITF first.',
      },
      {
        title: 'Register on BPP procurement portal',
        description:
          'Create an account on the BPP e-procurement portal using your company RC number.',
      },
      {
        title: 'Complete company profile',
        description:
          'Fill in detailed company information including sector, key personnel, and past federal contracts.',
      },
      {
        title: 'Upload required documents',
        description: 'Upload all prerequisite certificates and company documents.',
      },
      { title: 'Pay registration fee', description: 'Pay the applicable tier fee via Remita.' },
      {
        title: 'Certificate issued',
        description: 'BPP reviews your application and issues the Interim Registration Report.',
      },
    ],
    tips: [
      'BPP registration is the final step — complete all other certificates first',
      'The BPP certificate is often the slowest to renew — start 45 days before it expires',
      'BPP integrates with ClearPass — your registration status may be auto-verified',
    ],
    applicability: 'Mandatory for all companies bidding for federal government contracts',
  },
];

export function CertificateGuidesView() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<CertGuide | null>(null);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  if (selectedGuide) {
    return <GuideDetail guide={selectedGuide} onBack={() => setSelectedGuide(null)} />;
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="cp-page-title mb-2">Certificate Application Guides</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Step-by-step guides for obtaining each of the 6 mandatory compliance certificates
          </p>
        </header>

        <div className="space-y-3">
          {GUIDES.map((guide) => (
            <div key={guide.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(guide.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/20 transition-colors"
                aria-expanded={expanded === guide.id}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold"
                    style={{ backgroundColor: '#FF3000', fontSize: '11px' }}
                  >
                    {guide.shortName.split(' ')[0].slice(0, 4)}
                  </div>
                  <div className="text-left">
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>{guide.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      {guide.issuingAuthority} · {guide.processingTime}
                    </p>
                  </div>
                </div>
                {expanded === guide.id ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>

              {expanded === guide.id && (
                <div className="px-4 sm:px-5 pb-5 border-t border-border pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <InfoChip icon={Clock} label="Processing Time" value={guide.processingTime} />
                    <InfoChip icon={DollarSign} label="Typical Fee" value={guide.typicalFee} />
                    <InfoChip icon={FileText} label="Renewal" value={guide.renewalPeriod} />
                  </div>

                  <p className="text-muted-foreground mb-4" style={{ fontSize: '13px' }}>
                    <AlertCircle className="w-3.5 h-3.5 inline mr-1" style={{ color: '#F59E0B' }} />
                    {guide.applicability}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedGuide(guide)}
                      className="flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md text-white hover:opacity-90"
                      style={{ backgroundColor: '#FF3000', fontSize: '13px' }}
                    >
                      View Full Guide
                    </button>
                    <a
                      href={guide.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.preventDefault()}
                      className="flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
                      style={{ fontSize: '13px' }}
                    >
                      <ExternalLink className="w-4 h-4" /> Visit Portal
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      <div>
        <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
          {label}
        </p>
        <p style={{ fontSize: '13px', fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}

function GuideDetail({ guide, onBack }: { guide: CertGuide; onBack: () => void }) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to guides
        </button>

        <h1 className="cp-page-title mb-1">{guide.name}</h1>
        <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>
          {guide.issuingAuthority}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <InfoChip icon={Clock} label="Processing Time" value={guide.processingTime} />
          <InfoChip icon={DollarSign} label="Typical Fee" value={guide.typicalFee} />
          <InfoChip icon={FileText} label="Renewal Period" value={guide.renewalPeriod} />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-5">
          <h2 className="mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
            Required Documents
          </h2>
          <ul className="space-y-2">
            {guide.requiredDocuments.map((doc, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#1FC16B' }} />
                <span style={{ fontSize: '14px' }}>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-5">
          <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
            Step-by-Step Process
          </h2>
          <div className="space-y-4">
            {guide.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                  style={{ backgroundColor: '#FF3000', fontSize: '12px', minWidth: '24px' }}
                >
                  {i + 1}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{step.title}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: '13px' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-5">
          <h2 className="mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
            Pro Tips
          </h2>
          <ul className="space-y-2">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  style={{ color: '#FF3000', fontWeight: 700, fontSize: '14px', minWidth: '20px' }}
                >
                  →
                </span>
                <span style={{ fontSize: '14px' }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={guide.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.preventDefault()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-md text-white hover:opacity-90"
          style={{ backgroundColor: '#FF3000', fontSize: '15px' }}
        >
          <ExternalLink className="w-4 h-4" />
          Visit {guide.issuingAuthority} Portal
        </a>
      </div>
    </div>
  );
}
