import { useState, useEffect, useCallback } from 'react';
import {
  GamificationState,
  Achievement,
  AchievementType,
  XPEvent,
  GamificationAction,
  DEFAULT_STATE,
  ACHIEVEMENTS,
  calculateLevel,
  DailyChallenge,
  getDailyChallenges,
} from '../utils/gamification';

const STORAGE_KEY = 'clearpass_gamification';
const DAILY_CHALLENGES_KEY = 'clearpass_daily_challenges';

export function useGamification() {
  const [state, setState] = useState<GamificationState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => {
    if (typeof window === 'undefined') return getDailyChallenges();
    try {
      const stored = localStorage.getItem(DAILY_CHALLENGES_KEY);
      const date = localStorage.getItem(DAILY_CHALLENGES_KEY + '_date');
      const today = new Date().toDateString();

      // Reset challenges if it's a new day
      if (date !== today || !stored) {
        const newChallenges = getDailyChallenges();
        localStorage.setItem(DAILY_CHALLENGES_KEY, JSON.stringify(newChallenges));
        localStorage.setItem(DAILY_CHALLENGES_KEY + '_date', today);
        return newChallenges;
      }

      return stored ? JSON.parse(stored) : getDailyChallenges();
    } catch {
      return getDailyChallenges();
    }
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Persist daily challenges to localStorage
  useEffect(() => {
    localStorage.setItem(DAILY_CHALLENGES_KEY, JSON.stringify(dailyChallenges));
  }, [dailyChallenges]);

  // Check for newly unlocked achievements
  const checkAchievements = useCallback((action: GamificationAction) => {
    const unlocked: Achievement[] = [];
    const updatedUnlockedIds = new Set(state.unlockedAchievements);

    ACHIEVEMENTS.forEach(achievement => {
      if (updatedUnlockedIds.has(achievement.id)) return;

      let shouldUnlock = false;

      switch (achievement.type) {
        case AchievementType.FIRST_CERTIFICATE:
          shouldUnlock = action === GamificationAction.UPLOAD_CERTIFICATE && state.totalCertificates === 0;
          break;
        case AchievementType.CERTIFICATE_MASTER:
          shouldUnlock = action === GamificationAction.UPLOAD_CERTIFICATE && state.totalCertificates + 1 >= 6;
          break;
        case AchievementType.FIRST_VERIFICATION:
          shouldUnlock = action === GamificationAction.VERIFY_COMPANY && state.totalVerifications === 0;
          break;
        case AchievementType.VERIFICATION_EXPERT:
          shouldUnlock = action === GamificationAction.VERIFY_COMPANY && state.totalVerifications + 1 >= 10;
          break;
        case AchievementType.SCORE_MILESTONE:
          shouldUnlock = action === GamificationAction.SCORE_UPDATE && state.currentScore >= 100;
          break;
        case AchievementType.STREAK_WARRIOR:
          shouldUnlock = action === GamificationAction.DAILY_LOGIN && state.streakDays >= 7;
          break;
        case AchievementType.STREAK_LEGEND:
          shouldUnlock = action === GamificationAction.DAILY_LOGIN && state.streakDays >= 30;
          break;
        case AchievementType.FIRST_REPORT:
          shouldUnlock = action === GamificationAction.GENERATE_REPORT && state.totalReports === 0;
          break;
        case AchievementType.REPORT_POWER_USER:
          shouldUnlock = action === GamificationAction.GENERATE_REPORT && state.totalReports + 1 >= 5;
          break;
        case AchievementType.PROCUREMENT_READY:
          shouldUnlock = action === GamificationAction.SCORE_UPDATE && state.currentScore >= 85;
          break;
        case AchievementType.PERFECT_SCORE:
          shouldUnlock = action === GamificationAction.SCORE_UPDATE && state.currentScore === 100;
          break;
        case AchievementType.EXPLORER:
          shouldUnlock = action === GamificationAction.COMPLETE_ONBOARDING;
          break;
        case AchievementType.ENGAGED:
          shouldUnlock = state.totalActions >= 50;
          break;
        case AchievementType.COMPLIANCE_CHAMPION:
          shouldUnlock = action === GamificationAction.SCORE_UPDATE && state.currentScore >= 90 && state.streakDays >= 14;
          break;
      }

      if (shouldUnlock) {
        updatedUnlockedIds.add(achievement.id);
        unlocked.push(achievement);
      }
    });

    if (unlocked.length > 0) {
      setNewlyUnlocked(prev => [...prev, ...unlocked]);
      setState(prev => ({
        ...prev,
        unlockedAchievements: Array.from(updatedUnlockedIds),
        totalXP: prev.totalXP + unlocked.reduce((sum, a) => sum + a.xpReward, 0),
      }));
    }

    return unlocked;
  }, [state]);

  // Award XP for an action
  const awardXP = useCallback((action: GamificationAction, metadata?: Record<string, any>) => {
    const event: XPEvent = {
      id: `${action}-${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      metadata,
    };

    const xpGain = getXPForAction(action);
    const newTotalXP = state.totalXP + xpGain;
    const newLevel = calculateLevel(newTotalXP);

    setState(prev => ({
      ...prev,
      totalXP: newTotalXP,
      currentLevel: newLevel,
      recentEvents: [event, ...prev.recentEvents].slice(0, 20), // Keep last 20 events
      totalActions: prev.totalActions + 1,
    }));

    // Update specific counters
    setState(prev => {
      const updates: Partial<GamificationState> = {};

      switch (action) {
        case GamificationAction.UPLOAD_CERTIFICATE:
          updates.totalCertificates = prev.totalCertificates + 1;
          break;
        case GamificationAction.VERIFY_COMPANY:
          updates.totalVerifications = prev.totalVerifications + 1;
          break;
        case GamificationAction.GENERATE_REPORT:
          updates.totalReports = prev.totalReports + 1;
          break;
        case GamificationAction.SCORE_UPDATE:
          updates.currentScore = metadata?.score ?? prev.currentScore;
          break;
        case GamificationAction.DAILY_LOGIN:
          updates.streakDays = metadata?.streak ?? prev.streakDays + 1;
          updates.lastLoginDate = new Date().toISOString();
          break;
      }

      return { ...prev, ...updates };
    });

    // Check for achievements
    checkAchievements(action);

    return xpGain;
  }, [state.totalXP, state.totalCertificates, state.totalVerifications, state.totalReports, state.currentScore, state.streakDays, state.totalActions, checkAchievements]);

  // Clear newly unlocked achievements (call after displaying notification)
  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  // Get achievement progress for a specific achievement
  const getAchievementProgress = useCallback((achievementId: string): number => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return 0;
    if (state.unlockedAchievements.includes(achievementId)) return 100;

    switch (achievement.type) {
      case AchievementType.CERTIFICATE_MASTER:
        return Math.min((state.totalCertificates / 6) * 100, 100);
      case AchievementType.VERIFICATION_EXPERT:
        return Math.min((state.totalVerifications / 10) * 100, 100);
      case AchievementType.REPORT_POWER_USER:
        return Math.min((state.totalReports / 5) * 100, 100);
      case AchievementType.STREAK_WARRIOR:
        return Math.min((state.streakDays / 7) * 100, 100);
      case AchievementType.STREAK_LEGEND:
        return Math.min((state.streakDays / 30) * 100, 100);
      case AchievementType.ENGAGED:
        return Math.min((state.totalActions / 50) * 100, 100);
      default:
        return 0;
    }
  }, [state.totalCertificates, state.totalVerifications, state.totalReports, state.streakDays, state.totalActions, state.unlockedAchievements]);

  // Complete a daily challenge
  const completeDailyChallenge = useCallback((challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return 0;

    setDailyChallenges(prev =>
      prev.map(c => c.id === challengeId ? { ...c, completed: true } : c)
    );

    // Award XP for completing the challenge
    const xpGain = challenge.xpReward;
    const bonusXP = calculateStreakBonus();
    const totalXP = xpGain + bonusXP;

    setState(prev => ({
      ...prev,
      totalXP: prev.totalXP + totalXP,
      currentLevel: calculateLevel(prev.totalXP + totalXP),
    }));

    return totalXP;
  }, [dailyChallenges, state.totalXP]);

  // Calculate streak bonus (extra XP multiplier based on streak)
  const calculateStreakBonus = useCallback((): number => {
    if (state.streakDays >= 30) return 50; // 50 bonus XP for 30+ day streak
    if (state.streakDays >= 14) return 25; // 25 bonus XP for 14+ day streak
    if (state.streakDays >= 7) return 10; // 10 bonus XP for 7+ day streak
    return 0;
  }, [state.streakDays]);

  // Get daily challenges completion status
  const getDailyChallengesStatus = useCallback(() => {
    const completed = dailyChallenges.filter(c => c.completed).length;
    const total = dailyChallenges.length;
    const allCompleted = completed === total;
    return { completed, total, allCompleted };
  }, [dailyChallenges]);

  return {
    state,
    awardXP,
    newlyUnlocked,
    clearNewlyUnlocked,
    getAchievementProgress,
    dailyChallenges,
    completeDailyChallenge,
    calculateStreakBonus,
    getDailyChallengesStatus,
  };
}

function getXPForAction(action: GamificationAction): number {
  switch (action) {
    case GamificationAction.UPLOAD_CERTIFICATE:
      return 50;
    case GamificationAction.VERIFY_COMPANY:
      return 30;
    case GamificationAction.GENERATE_REPORT:
      return 25;
    case GamificationAction.SCORE_UPDATE:
      return 10;
    case GamificationAction.DAILY_LOGIN:
      return 5;
    case GamificationAction.COMPLETE_ONBOARDING:
      return 100;
    default:
      return 10;
  }
}