export enum AchievementType {
  FIRST_CERTIFICATE = 'first_certificate',
  CERTIFICATE_MASTER = 'certificate_master',
  FIRST_VERIFICATION = 'first_verification',
  VERIFICATION_EXPERT = 'verification_expert',
  SCORE_MILESTONE = 'score_milestone',
  STREAK_WARRIOR = 'streak_warrior',
  STREAK_LEGEND = 'streak_legend',
  FIRST_REPORT = 'first_report',
  REPORT_POWER_USER = 'report_power_user',
  PROCUREMENT_READY = 'procurement_ready',
  PERFECT_SCORE = 'perfect_score',
  EXPLORER = 'explorer',
  ENGAGED = 'engaged',
  COMPLIANCE_CHAMPION = 'compliance_champion',
}

export enum GamificationAction {
  UPLOAD_CERTIFICATE = 'upload_certificate',
  VERIFY_COMPANY = 'verify_company',
  GENERATE_REPORT = 'generate_report',
  SCORE_UPDATE = 'score_update',
  DAILY_LOGIN = 'daily_login',
  COMPLETE_ONBOARDING = 'complete_onboarding',
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  xpReward: number;
}

export interface XPEvent {
  id: string;
  action: GamificationAction;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export interface GamificationState {
  totalXP: number;
  currentLevel: number;
  currentScore: number;
  streakDays: number;
  lastLoginDate?: string;
  totalCertificates: number;
  totalVerifications: number;
  totalReports: number;
  totalActions: number;
  unlockedAchievements: string[];
  recentEvents: XPEvent[];
}

export const DEFAULT_STATE: GamificationState = {
  totalXP: 0,
  currentLevel: 1,
  currentScore: 0,
  streakDays: 0,
  totalCertificates: 0,
  totalVerifications: 0,
  totalReports: 0,
  totalActions: 0,
  unlockedAchievements: [],
  recentEvents: [],
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-certificate', title: 'First Certificate', description: 'Upload your first certificate', type: AchievementType.FIRST_CERTIFICATE, xpReward: 50 },
  { id: 'certificate-master', title: 'Certificate Master', description: 'Complete all core certificates', type: AchievementType.CERTIFICATE_MASTER, xpReward: 150 },
  { id: 'first-verification', title: 'First Verification', description: 'Run your first company verification', type: AchievementType.FIRST_VERIFICATION, xpReward: 50 },
  { id: 'verification-expert', title: 'Verification Expert', description: 'Verify 10 companies', type: AchievementType.VERIFICATION_EXPERT, xpReward: 125 },
  { id: 'score-milestone', title: 'Score Milestone', description: 'Reach a perfect compliance score', type: AchievementType.SCORE_MILESTONE, xpReward: 100 },
  { id: 'streak-warrior', title: 'Streak Warrior', description: 'Keep a 7-day activity streak', type: AchievementType.STREAK_WARRIOR, xpReward: 75 },
  { id: 'streak-legend', title: 'Streak Legend', description: 'Keep a 30-day activity streak', type: AchievementType.STREAK_LEGEND, xpReward: 200 },
  { id: 'first-report', title: 'First Report', description: 'Generate your first report', type: AchievementType.FIRST_REPORT, xpReward: 50 },
  { id: 'report-power-user', title: 'Report Power User', description: 'Generate 5 reports', type: AchievementType.REPORT_POWER_USER, xpReward: 125 },
  { id: 'procurement-ready', title: 'Procurement Ready', description: 'Reach procurement-ready status', type: AchievementType.PROCUREMENT_READY, xpReward: 100 },
  { id: 'perfect-score', title: 'Perfect Score', description: 'Reach 100/100 compliance', type: AchievementType.PERFECT_SCORE, xpReward: 150 },
  { id: 'explorer', title: 'Explorer', description: 'Complete onboarding', type: AchievementType.EXPLORER, xpReward: 50 },
  { id: 'engaged', title: 'Engaged', description: 'Complete 50 actions', type: AchievementType.ENGAGED, xpReward: 100 },
  { id: 'compliance-champion', title: 'Compliance Champion', description: 'Maintain high compliance momentum', type: AchievementType.COMPLIANCE_CHAMPION, xpReward: 200 },
];

export function calculateLevel(totalXP: number): number {
  return Math.max(1, Math.floor(totalXP / 250) + 1);
}

export function getDailyChallenges(): DailyChallenge[] {
  return [
    {
      id: 'verify-status',
      title: 'Check compliance status',
      description: 'Review your compliance dashboard',
      xpReward: 10,
      completed: false,
    },
    {
      id: 'review-alerts',
      title: 'Review alerts',
      description: 'Open active certificate alerts',
      xpReward: 10,
      completed: false,
    },
  ];
}
