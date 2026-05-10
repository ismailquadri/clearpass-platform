import { Trophy, Star, Flame, Award, Target, Zap } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';
import { useGamification } from '../contexts/GamificationContext';
import {
  ACHIEVEMENTS,
  getLevelFromXP,
  getCurrentLevelXP,
  getXPToNextLevel,
  getRarityColor,
  getRarityLabel,
} from '../utils/gamification';

export function AchievementsPanel() {
  const { showToast } = useToast();
  const { state, getAchievementProgress, dailyChallenges, completeDailyChallenge, calculateStreakBonus, getDailyChallengesStatus } = useGamification();
  const [showAchievements, setShowAchievements] = useState(false);

  const currentLevel = getLevelFromXP(state.totalXP);
  const currentLevelXP = getCurrentLevelXP(state.totalXP);
  const xpNeeded = getXPToNextLevel(state.totalXP);
  const streakBonus = calculateStreakBonus();
  const challengesStatus = getDailyChallengesStatus();

  const getUnlockedAchievements = () => {
    return ACHIEVEMENTS.filter(a => state.unlockedAchievements.includes(a.id));
  };

  const categoryIcons = {
    compliance: Trophy,
    streak: Flame,
    social: Star,
    milestone: Award,
  };

  return (
    <div className="space-y-4">
      {/* XP Progress Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FF3000]" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Level {currentLevel}</span>
          </div>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {state.totalXP} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF3000] to-[#FF6B6B] transition-all duration-500"
            style={{
              width: `${(currentLevelXP / xpNeeded) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{ fontSize: '11px', color: '#6B7280' }}>
            {currentLevelXP} / {xpNeeded} XP
          </span>
          <span style={{ fontSize: '11px', color: '#6B7280' }}>
            Level {currentLevel + 1}
          </span>
        </div>
      </div>

      {/* Streak Display */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF3000]" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Compliance Streak</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#FF3000' }}>
            {state.streakDays} days
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#6B7280' }} className="mt-1">
          Longest streak: {state.streakDays} days
        </p>
        {streakBonus > 0 && (
          <div className="mt-2 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded">
            <p style={{ fontSize: '11px', color: '#854D0E' }}>
              🔥 Streak Bonus: +{streakBonus} XP on all challenges
            </p>
          </div>
        )}
      </div>

      {/* Daily Challenges */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FF3000]" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Daily Challenges</span>
          </div>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {challengesStatus.completed}/{challengesStatus.total}
          </span>
        </div>
        <div className="space-y-2">
          {dailyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                challenge.completed
                  ? 'border-green-500 bg-green-50'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <div className="flex-1">
                <p style={{ fontSize: '13px', fontWeight: 500 }}>
                  {challenge.title}
                </p>
                <p style={{ fontSize: '11px', color: '#6B7280' }}>
                  {challenge.description}
                </p>
              </div>
              {!challenge.completed && (
                <button
                  onClick={() => {
                    const totalXP = completeDailyChallenge(challenge.id);
                    showToast('success', 'Challenge Complete!', `+${totalXP} XP${streakBonus > 0 ? ` (including ${streakBonus} streak bonus)` : ''}`);
                  }}
                  className="px-3 py-1.5 rounded-md text-white text-xs"
                  style={{ backgroundColor: '#FF3000' }}
                >
                  +{challenge.xpReward + streakBonus} XP
                </button>
              )}
              {challenge.completed && (
                <span className="text-green-600 text-xs font-medium">✓ Done</span>
              )}
            </div>
          ))}
        </div>
        {challengesStatus.allCompleted && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-center">
            <p style={{ fontSize: '12px', color: '#854D0E', fontWeight: 600 }}>
              🎉 All challenges completed! Come back tomorrow for more.
            </p>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FF3000]" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Achievements</span>
          </div>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {getUnlockedAchievements().length} / {ACHIEVEMENTS.length}
          </span>
        </div>

        {/* Unlocked Achievements */}
        {getUnlockedAchievements().length > 0 && (
          <div className="mb-4">
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '8px' }}>
              Recently Unlocked
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getUnlockedAchievements().slice(0, 6).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 rounded-lg border-2 text-center"
                    style={{
                      borderColor: getRarityColor(achievement.rarity),
                      backgroundColor: `${getRarityColor(achievement.rarity)}10`,
                    }}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <p style={{ fontSize: '11px', fontWeight: 600 }}>
                      {achievement.title}
                    </p>
                    <p style={{ fontSize: '10px', color: '#6B7280' }}>
                      +{achievement.xpReward} XP
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* View All Achievements Button */}
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="w-full px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm"
        >
          {showAchievements ? 'Hide' : 'View All'} Achievements
        </button>

        {/* All Achievements Modal */}
        {showAchievements && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>All Achievements</h2>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="p-2 hover:bg-muted rounded-md"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Filter by category */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(['all', 'compliance', 'streak', 'social', 'milestone'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => {}}
                    className="px-3 py-1 rounded-full text-xs font-medium border border-[#FF3000] hover:bg-[#FF3000] hover:text-white transition-colors"
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const CategoryIcon = categoryIcons[achievement.category];
                  const isUnlocked = state.unlockedAchievements.includes(achievement.id);
                  const progress = getAchievementProgress(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${
                        isUnlocked
                          ? 'opacity-100'
                          : 'opacity-50 grayscale'
                      } transition-all`}
                      style={{
                        borderColor: isUnlocked
                          ? getRarityColor(achievement.rarity)
                          : '#E5E7EB',
                        backgroundColor: isUnlocked
                          ? `${getRarityColor(achievement.rarity)}10`
                          : 'transparent',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600 }}>
                              {achievement.title}
                            </p>
                            <span
                              className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                              style={{
                                color: getRarityColor(achievement.rarity),
                                backgroundColor: isUnlocked
                                  ? `${getRarityColor(achievement.rarity)}20`
                                  : '#E5E7EB',
                              }}
                            >
                              {getRarityLabel(achievement.rarity)}
                            </span>
                          </div>
                        </div>
                        {isUnlocked && (
                          <span className="text-green-600 text-lg">✓</span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <CategoryIcon className="w-3 h-3" style={{ color: '#6B7280' }} />
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>
                          {achievement.category}
                        </span>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>
                          • +{achievement.xpReward} XP
                        </span>
                      </div>
                      {!isUnlocked && progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-[#FF3000] transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p style={{ fontSize: '10px', color: '#6B7280' }} className="mt-1">
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}