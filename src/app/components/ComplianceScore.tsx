import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ComplianceScoreProps {
  score: number;
  isProcurementReady: boolean;
  projectedScore?: {
    score: number;
    date: string;
    certificate: string;
  };
}

export function ComplianceScore({
  score,
  isProcurementReady,
  projectedScore,
}: ComplianceScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'rgb(31, 193, 107)'; // green
    if (score >= 60) return 'rgb(250, 115, 25)'; // orange
    return 'rgb(251, 55, 72)'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Attention Required';
    return 'Action Needed';
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
        Compliance Health Score
      </h3>

      <div className="flex items-start gap-6">
        {/* Score Circle */}
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="10" />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 327} 327`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ fontSize: '36px', fontWeight: '600', lineHeight: '1' }}>{score}</span>
            <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
              / 100
            </span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${scoreColor}20`,
                  color: scoreColor,
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                {scoreLabel}
              </span>
            </div>
            <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              Your compliance score is calculated based on certificate coverage, freshness, and
              verification quality.
            </p>
          </div>

          {/* Procurement Ready Badge */}
          {isProcurementReady ? (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-md"
              style={{ backgroundColor: 'rgb(31, 193, 107, 0.1)' }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: 'rgb(31, 193, 107)' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgb(31, 193, 107)' }}>
                  Procurement Ready
                </p>
                <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                  Eligible for federal procurement
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-md"
              style={{ backgroundColor: 'rgb(251, 55, 72, 0.1)' }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: 'rgb(251, 55, 72)' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgb(251, 55, 72)' }}>
                  Ineligible to Bid
                </p>
                <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                  Complete all certificates to become eligible
                </p>
              </div>
            </div>
          )}

          {/* Projected Score Warning */}
          {projectedScore && (
            <div
              className="px-3 py-2 rounded-md border border-[#e5e5e5]"
              style={{ backgroundColor: 'rgb(250, 115, 25, 0.1)' }}
            >
              <p style={{ fontSize: '12px', fontWeight: '500', color: 'rgb(250, 115, 25)' }}>
                Score at Risk
              </p>
              <p
                className="text-muted-foreground mt-0.5 text-[#404040]"
                style={{ fontSize: '13px' }}
              >
                Projected score on {projectedScore.date}:{' '}
                <strong>{projectedScore.score}/100</strong> if {projectedScore.certificate} is not
                renewed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
