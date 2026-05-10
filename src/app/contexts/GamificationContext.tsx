import { createContext, useContext, ReactNode } from 'react';
import { useGamification as useGamificationHook } from '../hooks/useGamification';
import type { Achievement, DailyChallenge, GamificationState, GamificationAction } from '../utils/gamification';

interface GamificationContextValue {
  awardXP: (action: GamificationAction, metadata?: Record<string, any>) => number;
  newlyUnlocked: Achievement[];
  clearNewlyUnlocked: () => void;
  getAchievementProgress: (achievementId: string) => number;
  dailyChallenges: DailyChallenge[];
  completeDailyChallenge: (challengeId: string) => number;
  calculateStreakBonus: () => number;
  getDailyChallengesStatus: () => { completed: number; total: number; allCompleted: boolean };
  state: GamificationState;
}

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const gamification = useGamificationHook();

  return (
    <GamificationContext.Provider value={gamification}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}