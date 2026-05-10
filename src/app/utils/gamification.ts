/**
 * Gamification System - Achievements, XP, and Rewards
 */

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
  icon: string;
  xpReward: number;
  type: AchievementType;
  category: 'compliance' | 'streak' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface XPEvent {
  id: string;
  action: GamificationAction;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface GamificationState {
  totalXP: number;
  currentLevel: number;
  unlockedAchievements: string[];
  totalCertificates: number;
  totalVerifications: number;
  totalReports: number;
  currentScore: number;
  streakDays: number;
  lastLoginDate?: string;
  totalActions: number;
  recentEvents: XPEvent[];
}

export const DEFAULT_STATE: GamificationState = {
  totalXP: 0,
  currentLevel: 1,
  unlockedAchievements: [],
  totalCertificates: 0,
  totalVerifications: 0,
  totalReports: 0,
  currentScore: 0,
  streakDays: 0,
  totalActions: 0,
  recentEvents: [],
};

export interface UserProgress {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
  streak: number;
  longestStreak: number;
  achievements: Achievement[];
  dailyChallengesCompleted: number;
  dailyChallengesTotal: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Compliance Achievements
  {
    id: 'first-certificate',
    title: 'First Certificate',
    description: 'Upload your first certificate',
    icon: '🎯',
    xpReward: 100,
    type: AchievementType.FIRST_CERTIFICATE,
    category: 'compliance',
    rarity: 'common',
  },
  {
    id: 'certificate-master',
    title: 'Certificate Master',
    description: 'Upload 6 different certificates',
    icon: '📜',
    xpReward: 300,
    type: AchievementType.CERTIFICATE_MASTER,
    category: 'compliance',
    rarity: 'rare',
  },
  {
    id: 'procurement-ready',
    title: 'Procurement Ready',
    description: 'Achieve 85% compliance score',
    icon: '🏆',
    xpReward: 500,
    type: AchievementType.PROCUREMENT_READY,
    category: 'compliance',
    rarity: 'epic',
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Achieve 100% compliance score',
    icon: '⭐',
    xpReward: 1000,
    type: AchievementType.PERFECT_SCORE,
    category: 'compliance',
    rarity: 'legendary',
  },
  // Streak Achievements
  {
    id: 'streak-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day compliance streak',
    icon: '🔥',
    xpReward: 200,
    type: AchievementType.STREAK_WARRIOR,
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'streak-legend',
    title: 'Month Master',
    description: 'Maintain a 30-day compliance streak',
    icon: '👑',
    xpReward: 500,
    type: AchievementType.STREAK_LEGEND,
    category: 'streak',
    rarity: 'epic',
  },
  // Verification Achievements
  {
    id: 'first-verification',
    title: 'First Verification',
    description: 'Verify your first company',
    icon: '🔍',
    xpReward: 50,
    type: AchievementType.FIRST_VERIFICATION,
    category: 'compliance',
    rarity: 'common',
  },
  {
    id: 'verification-expert',
    title: 'Verification Expert',
    description: 'Verify 10 companies',
    icon: '📊',
    xpReward: 300,
    type: AchievementType.VERIFICATION_EXPERT,
    category: 'compliance',
    rarity: 'rare',
  },
  // Report Achievements
  {
    id: 'first-report',
    title: 'First Report',
    description: 'Generate your first compliance report',
    icon: '📄',
    xpReward: 50,
    type: AchievementType.FIRST_REPORT,
    category: 'compliance',
    rarity: 'common',
  },
  {
    id: 'report-power-user',
    title: 'Report Power User',
    description: 'Generate 5 compliance reports',
    icon: '📈',
    xpReward: 150,
    type: AchievementType.REPORT_POWER_USER,
    category: 'compliance',
    rarity: 'rare',
  },
  // Milestone Achievements
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Complete onboarding',
    icon: '🗺️',
    xpReward: 100,
    type: AchievementType.EXPLORER,
    category: 'milestone',
    rarity: 'common',
  },
  {
    id: 'engaged',
    title: 'Engaged User',
    description: 'Complete 50 actions',
    icon: '💪',
    xpReward: 200,
    type: AchievementType.ENGAGED,
    category: 'milestone',
    rarity: 'rare',
  },
  {
    id: 'compliance-champion',
    title: 'Compliance Champion',
    description: 'Achieve 90% score with 14-day streak',
    icon: '🏅',
    xpReward: 1000,
    type: AchievementType.COMPLIANCE_CHAMPION,
    category: 'milestone',
    rarity: 'legendary',
  },
];

export const XP_LEVELS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6600, 8200, 10000, 12000, 14200, 16600, 19200, 22000, 25000, 28000, 31000];

export function calculateLevel(totalXP: number): number {
  return getLevelFromXP(totalXP);
}

export function getLevelFromXP(xp: number): number {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i]) return i + 1;
  }
  return 1;
}

export function getXPForLevel(level: number): number {
  return XP_LEVELS[level - 1] || 0;
}

export function getXPToNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  return nextLevelXP - xp;
}

export function getCurrentLevelXP(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  const levelXP = getXPForLevel(currentLevel);
  return xp - levelXP;
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return '#9CA3AF';
    case 'rare':
      return '#3B82F6';
    case 'epic':
      return '#8B5CF6';
    case 'legendary':
      return '#F59E0B';
    default:
      return '#9CA3AF';
  }
}

export function getRarityLabel(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'Common';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Epic';
    case 'legendary':
      return 'Legendary';
    default:
      return 'Common';
  }
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  category: 'compliance' | 'social' | 'learning';
}

export const getDailyChallenges = (): DailyChallenge[] => {
  // In production, these would come from the backend
  return [
    {
      id: 'daily-1',
      title: 'Certificate Check',
      description: 'Review your certificate expiry dates',
      xpReward: 50,
      completed: false,
      category: 'compliance',
    },
    {
      id: 'daily-2',
      title: 'Profile Update',
      description: 'Update your company profile information',
      xpReward: 30,
      completed: false,
      category: 'compliance',
    },
    {
      id: 'daily-3',
      title: 'Share Progress',
      description: 'Share your compliance progress with a colleague',
      xpReward: 40,
      completed: false,
      category: 'social',
    },
  ];
};