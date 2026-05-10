import { FileText, Download, Calendar, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { useToast } from './ToastProvider';

interface Report {
  id: string;
  type: 'procurement-ready' | 'provisional' | 'monthly' | 'audit-trail';
  title: string;
  description: string;
  generatedDate: string;
  validUntil?: string;
  score: number;
  status: 'available' | 'expired' | 'locked';
  fileSize: string;
}

export function ReportsView() {
  const { showToast } = useToast();

  const availableReports: Report[] = [
    {
      id: '1',
      type: 'procurement-ready',
      title: 'Procurement Ready Report',
      description: 'Full compliance report for federal tender submission',
      generatedDate: '9 May 2026',
      validUntil: '16 May 2026',
      score: 73,
      status: 'locked',
      fileSize: '2.4 MB',
    },
    {
      id: '2',
      type: 'provisional',
      title: 'Provisional Compliance Report',
      description: 'Interim report with pending verifications noted',
      generatedDate: '9 May 2026',
      validUntil: '16 May 2026',
      score: 73,
      status: 'available',
      fileSize: '2.1 MB',
    },
    {
      id: '3',
      type: 'monthly',
      title: 'Monthly Compliance Summary - April 2026',
      description: 'Complete monthly compliance activity report',
      generatedDate: '1 May 2026',
      score: 78,
      status: 'available',
      fileSize: '3.8 MB',
    },
    {
      id: '4',
      type: 'audit-trail',
      title: 'Verification Audit Trail',
      description: 'Complete history of all certificate verifications',
      generatedDate: '9 May 2026',
      score: 73,
      status: 'available',
      fileSize: '1.2 MB',
    },
  ];

  const generateNewReport = () => {
    showToast(
      'success',
      'Report Generated',
      'Your compliance report is being generated and will be ready in a few moments'
    );
  };

  const downloadReport = (report: Report) => {
    if (report.status === 'locked') {
      showToast(
        'error',
        'Report Locked',
        'This report requires a compliance score of 80+ to download'
      );
      return;
    }
    showToast('success', 'Download Started', `Downloading ${report.title}`);
  };

  const getReportIcon = (_type: Report['type']) => {
    return FileText;
  };

  const getReportColor = (type: Report['type']) => {
    switch (type) {
      case 'procurement-ready':
        return '#FF3000';
      case 'provisional':
        return '#FF3000';
      case 'monthly':
        return '#FF3000';
      case 'audit-trail':
        return '#FF3000';
      default:
        return 'rgb(92, 92, 92)';
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 style={{ fontSize: '32px' }}>Compliance Reports</h1>
            <button
              onClick={generateNewReport}
              className="px-4 py-2 rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: '#FF3000' }}
            >
              <FileText className="w-5 h-5" />
              Generate New Report
            </button>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Download official compliance reports for tender submissions and audits
          </p>
        </div>

        {/* Generate Report Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FF3000' }}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2" style={{ fontSize: '18px', fontWeight: '500' }}>
                Generate Compliance Report
              </h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
                Create an official compliance report for federal procurement submission. Reports are
                timestamped, digitally signed, and valid for 7 days.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={generateNewReport}
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: '#FF3000' }}
                >
                  Generate Full Report
                </button>
                <button className="px-4 py-2 rounded-md border border-border bg-card hover:bg-muted transition-colors">
                  Generate Provisional Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Requirements Notice */}
        <div
          className="px-4 py-3 rounded-lg border border-[#e5e5e5] flex items-start gap-3 mb-6"
          style={{
            backgroundColor: 'rgba(255, 48, 0, 0.1)',
          }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#FF3000' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}>
              Report Requirements
            </p>
            <p className="caption text-muted-foreground mt-1">
              Full Procurement Ready reports require: Score ≥80, NHIA active, no expired
              certificates, CAC verified. Current status prevents full report generation.
            </p>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
            Available Reports
          </h3>

          {availableReports.map((report) => {
            const Icon = getReportIcon(report.type);
            const color = getReportColor(report.type);

            return (
              <div
                key={report.id}
                className="bg-card border border-border rounded-lg p-5 transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 style={{ fontSize: '16px', fontWeight: '500' }}>{report.title}</h4>
                          {report.status === 'locked' && (
                            <span
                              className="px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{
                                backgroundColor: 'rgba(255, 48, 0, 0.1)',
                                color: '#FF3000',
                                fontSize: '13px',
                              }}
                            >
                              <Lock className="w-3 h-3" />
                              Locked
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3" style={{ fontSize: '14px' }}>
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="caption">Generated: {report.generatedDate}</span>
                          </div>
                          {report.validUntil && (
                            <>
                              <span className="caption">•</span>
                              <span className="caption">Valid until: {report.validUntil}</span>
                            </>
                          )}
                          <span className="caption">•</span>
                          <span className="caption">{report.fileSize}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="caption text-muted-foreground mb-1">Score</p>
                        <p style={{ fontSize: '24px', fontWeight: '600', color }}>
                          {report.score}
                          <span style={{ fontSize: '14px', fontWeight: '400' }}>/100</span>
                        </p>
                      </div>
                    </div>

                    {report.status === 'locked' && (
                      <div
                        className="px-3 py-2 rounded-md mb-3"
                        style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className="w-4 h-4"
                            style={{ color: '#FF3000' }}
                          />
                          <p className="caption" style={{ color: '#FF3000' }}>
                            Report locked: Score must be ≥80 with all certificates active to
                            generate Procurement Ready report
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadReport(report)}
                        disabled={report.status === 'locked'}
                        className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => downloadReport(report)}
                        disabled={report.status === 'locked'}
                        className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        View Report
                      </button>
                      {report.type === 'procurement-ready' && report.status !== 'locked' && (
                        <button
                          onClick={() =>
                            showToast('success', 'Email Sent', 'Report sent to procurement office')
                          }
                          className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                        >
                          Email to MDA
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Report Information */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4" style={{ fontSize: '16px', fontWeight: '500' }}>
            About Compliance Reports
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4
                className="mb-2"
                style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}
              >
                Procurement Ready Report
              </h4>
              <p className="caption text-muted-foreground">
                Full compliance report accepted by all federal MDAs. Requires score ≥80, NHIA
                active, no expired certificates. Valid for 7 days from generation.
              </p>
            </div>
            <div>
              <h4
                className="mb-2"
                style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}
              >
                Provisional Report
              </h4>
              <p className="caption text-muted-foreground">
                Interim report for companies with certificates pending verification. Clearly
                watermarked. Requires score ≥70. Pending certificates are flagged.
              </p>
            </div>
            <div>
              <h4
                className="mb-2"
                style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}
              >
                Monthly Summary
              </h4>
              <p className="caption text-muted-foreground">
                Complete monthly compliance activity report including score history, certificate
                renewals, and verification events.
              </p>
            </div>
            <div>
              <h4
                className="mb-2"
                style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}
              >
                Audit Trail Report
              </h4>
              <p className="caption text-muted-foreground">
                Complete verification history with timestamps, officer IDs, and API confirmation
                codes. Audit-ready format for compliance reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
