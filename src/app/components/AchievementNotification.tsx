import { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import type { Achievement } from '../utils/gamification';
import { CelebrationAnimation } from './CelebrationAnimation';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
}

export function AchievementNotification({ achievements, onClose }: AchievementNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerCelebration, setTriggerCelebration] = useState(false);

  useEffect(() => {
    if (achievements.length > 0) {
      setVisible(true);
      setTriggerCelebration(true);
      const timer = setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setVisible(false);
          setTimeout(onClose, 300);
        }
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievements, currentIndex, onClose]);

  if (achievements.length === 0 || !visible) return null;

  const achievement = achievements[currentIndex];
  const isMultiple = achievements.length > 1;

  return (
    <>
      <CelebrationAnimation
        trigger={triggerCelebration}
        onComplete={() => setTriggerCelebration(false)}
      />
      <div
        className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right-full"
        style={{ animationDuration: '0.3s' }}
      >
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg shadow-lg p-4 relative">
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                Achievement Unlocked!
              </span>
              {isMultiple && (
                <span className="text-xs text-gray-500">
                  {currentIndex + 1}/{achievements.length}
                </span>
              )}
            </div>

            <h3 className="font-bold text-gray-900 text-sm mb-1">
              {achievement.title}
            </h3>

            <p className="text-xs text-gray-600 mb-2">
              {achievement.description}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-orange-600">
                +{achievement.xpReward} XP
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 capitalize">
                {achievement.category}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar for multiple achievements */}
        {isMultiple && (
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / achievements.length) * 100}%` }}
            />
          </div>
        )}
      </div>
      </div>
    </>
  );
}