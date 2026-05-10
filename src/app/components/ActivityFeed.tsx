import { useState } from 'react';
import { Activity, Trophy, Upload, CheckCircle, TrendingUp, Award } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  company: string;
  action: string;
  timestamp: string;
  icon: string;
  type: 'achievement' | 'upload' | 'verification' | 'streak' | 'level';
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    user: 'Sarah Johnson',
    company: 'TechCorp Nigeria',
    action: 'unlocked "Perfect Score" achievement',
    timestamp: '2 minutes ago',
    icon: '🏆',
    type: 'achievement',
  },
  {
    id: '2',
    user: 'Emeka Okafor',
    company: 'BuildRight Construction',
    action: 'uploaded NSITF certificate',
    timestamp: '15 minutes ago',
    icon: '📄',
    type: 'upload',
  },
  {
    id: '3',
    user: 'Amina Yusuf',
    company: 'HealthPlus Ltd',
    action: 'reached Level 10',
    timestamp: '1 hour ago',
    icon: '⭐',
    type: 'level',
  },
  {
    id: '4',
    user: 'Chinedu Eze',
    company: 'FastTrack Logistics',
    action: 'verified 3 companies',
    timestamp: '2 hours ago',
    icon: '✅',
    type: 'verification',
  },
  {
    id: '5',
    user: 'Fatima Ali',
    company: 'EduTech Solutions',
    action: 'maintained 30-day compliance streak',
    timestamp: '3 hours ago',
    icon: '🔥',
    type: 'streak',
  },
  {
    id: '6',
    user: 'Ibrahim Musa',
    company: 'AgroNigeria Ltd',
    action: 'unlocked "Week Warrior" achievement',
    timestamp: '5 hours ago',
    icon: '🎯',
    type: 'achievement',
  },
];

type FeedFilter = 'all' | 'achievements' | 'uploads' | 'verifications';

export function ActivityFeed() {
  const [filter, setFilter] = useState<FeedFilter>('all');

  const getFilteredActivities = () => {
    if (filter === 'all') return MOCK_ACTIVITIES;
    return MOCK_ACTIVITIES.filter(activity => {
      switch (filter) {
        case 'achievements':
          return activity.type === 'achievement';
        case 'uploads':
          return activity.type === 'upload';
        case 'verifications':
          return activity.type === 'verification';
        default:
          return true;
      }
    });
  };

  const getActionIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'streak':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'level':
        return <Award className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredActivities = getFilteredActivities();

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#FF3000]" />
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Activity Feed</h3>
        </div>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>
          Live updates
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(['all', 'achievements', 'uploads', 'verifications'] as FeedFilter[]).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === filterType
                ? 'bg-[#FF3000] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterType === 'all' ? 'All' : filterType}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">{activity.icon}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '13px', fontWeight: 500 }}>
                <span className="font-semibold">{activity.user}</span>
                <span style={{ fontSize: '13px', color: '#6B7280' }}> from </span>
                <span className="font-medium">{activity.company}</span>
              </p>
              <p style={{ fontSize: '12px', color: '#6B7280' }} className="mt-0.5">
                {activity.action}
              </p>
              <p style={{ fontSize: '11px', color: '#9CA3AF' }} className="mt-1">
                {activity.timestamp}
              </p>
            </div>

            {/* Type Icon */}
            <div className="flex-shrink-0">
              {getActionIcon(activity.type)}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button className="w-full mt-4 px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm">
        Load More Activity
      </button>
    </div>
  );
}