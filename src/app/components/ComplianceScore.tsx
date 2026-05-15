import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { memo, useMemo } from 'react';

interface ComplianceScoreProps {
  score: number;
  isProcurementReady: boolean;
  activeCerts?: number;
  totalCerts?: number;
  projectedScore?: {
    score: number;
    date: string;
    certificate: string;
  };
  /** If true, score is capped at 49 because NHIA is missing */
  nhiaHardBlock?: boolean;
  /** If true, CAC is unverified — show "Not Available" instead of score */
  cacUnverified?: boolean;
  /** If true, at least one cert is expired — Ineligible to Bid */
  hasExpiredCert?: boolean;
}

export const ComplianceScore = memo(function ComplianceScore({
  score,
  isProcurementReady,
  activeCerts,
  totalCerts = 6,
  projectedScore,
  nhiaHardBlock = false,
  cacUnverified = false,
  hasExpiredCert = false,
}: ComplianceScoreProps) {
  const scoreColor = useMemo(() => {
    if (cacUnverified) return '#9CA3AF';
    if (score >= 80) return '#1FC16B';
    if (score >= 60) return '#F59E0B';
    return '#FF3000';
  }, [score, cacUnverified]);

  const scoreLabel = useMemo(() => {
    if (cacUnverified) return 'Not Available';
    if (nhiaHardBlock) return 'NHIA Required';
    if (hasExpiredCert) return 'Ineligible';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Needs Attention';
    return 'Action Required';
  }, [score, cacUnverified, nhiaHardBlock, hasExpiredCert]);

  const goalText = useMemo(() => {
    if (isProcurementReady) return null;
    if (activeCerts === undefined) return null;
    const missing = totalCerts - activeCerts;
    if (missing <= 0) return null;
    return `${missing} more certificate${missing > 1 ? 's' : ''} to reach Procurement Ready`;
  }, [isProcurementReady, activeCerts, totalCerts]);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="mb-4 text-base font-semibold">
        Compliance Health Score
      </p>

      <div className="flex items-start gap-6">
        {/* Score Circle */}
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="10" />
            {!cacUnverified && (
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
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {cacUnverified ? (
              <span className="text-[22px] font-semibold text-[#9CA3AF] text-center leading-[1.2]">N/A</span>
            ) : (
              <>
                <span className="text-[36px] font-semibold leading-[1]">{score}</span>
                <span className="text-muted-foreground text-sm">/ 100</span>
              </>
            )}
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${scoreColor}20`,
                  color: scoreColor,
                }}
              >
                {scoreLabel}
              </span>
            </div>
            <p className="text-muted-foreground text-[#404040] text-sm">
              Your compliance score is calculated based on certificate coverage, freshness, and
              verification quality.
            </p>
          </div>

          {/* Hard block alerts */}
          {cacUnverified && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-[rgba(156,163,175,0.12)] border border-[#9CA3AF]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#9CA3AF]" />
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Score Not Available</p>
                <p className="text-muted-foreground text-xs">Complete CAC verification to unlock your compliance score</p>
              </div>
            </div>
          )}
          {nhiaHardBlock && !cacUnverified && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-[rgba(255,48,0,0.08)] border border-[rgba(255,48,0,0.3)]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF3000]" />
              <div>
                <p className="text-sm font-medium text-[#FF3000]">Score capped at 49 — NHIA required</p>
                <p className="text-muted-foreground text-xs">NHIA enrollment is mandatory for federal procurement eligibility</p>
              </div>
            </div>
          )}

          {/* Procurement Ready Badge */}
          {isProcurementReady ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(255,48,0,0.1)]">
              <CheckCircle2 className="w-4 h-4 text-[#FF3000]" />
              <div>
                <p className="text-sm font-medium text-[#FF3000]">
                  Procurement Ready
                </p>
                <p className="text-muted-foreground text-[#404040] text-sm">
                  Eligible for federal procurement
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(255,48,0,0.1)]">
              <AlertTriangle className="w-4 h-4 text-[#FF3000]" />
              <div>
                <p className="text-sm font-medium text-[#FF3000]">
                  Ineligible to Bid
                </p>
                <p className="text-muted-foreground text-[#404040] text-sm">
                  Complete all certificates to become eligible
                </p>
              </div>
            </div>
          )}

          {/* Certificate progress toward goal */}
          {goalText && activeCerts !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-muted-foreground text-xs">
                  {activeCerts}/{totalCerts} certificates active
                </p>
                <p className="text-xs font-medium" style={{ color: scoreColor }}>
                  {goalText}
                </p>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(activeCerts / totalCerts) * 100}%`,
                    backgroundColor: scoreColor,
                  }}
                />
              </div>
            </div>
          )}

          {/* Projected Score Warning */}
          {projectedScore && (
            <div className="px-3 py-2 rounded-md border border-[#e5e5e5] bg-[rgba(255,48,0,0.08)]">
              <p className="text-xs font-medium text-[#FF3000]">Score at Risk</p>
              <p className="text-muted-foreground mt-0.5 text-[#404040] text-sm">
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
});
