import { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  company: string;
  xp: number;
  level: number;
  complianceScore: number;
  streak: number;
  isCurrentUser: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Nigeria',
    xp: 15420,
    level: 12,
    complianceScore: 98,
    streak: 45,
    isCurrentUser: false,
  },
  {
    id: '2',
    name: 'Emeka Okafor',
    company: 'BuildRight Construction',
    xp: 12300,
    level: 10,
    complianceScore: 95,
    streak: 30,
    isCurrentUser: false,
  },
  {
    id: '3',
    name: 'Amina Yusuf',
    company: 'HealthPlus Ltd',
    xp: 10800,
    level: 9,
    complianceScore: 92,
    streak: 28,
    isCurrentUser: false,
  },
  {
    id: '4',
    name: 'Your Company',
    company: 'Current User',
    xp: 2500,
    level: 4,
    complianceScore: 41,
    streak: 14,
    isCurrentUser: true,
  },
  {
    id: '5',
    name: 'Chinedu Eze',
    company: 'FastTrack Logistics',
    xp: 8900,
    level: 8,
    complianceScore: 88,
    streak: 21,
    isCurrentUser: false,
  },
];

type LeaderboardTab = 'xp' | 'compliance' | 'streak';

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('xp');

  const getSortedLeaderboard = () => {
    switch (activeTab) {
      case 'xp':
        return [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp);
      case 'compliance':
        return [...MOCK_LEADERBOARD].sort((a, b) => b.complianceScore - a.complianceScore);
      case 'streak':
        return [...MOCK_LEADERBOARD].sort((a, b) => b.streak - a.streak);
      default:
        return MOCK_LEADERBOARD;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-gray-500">#{rank}</span>;
  };

  const getRankStyle = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'border-2 border-[#FF3000] bg-[#FF3000]5';
    }
    if (rank <= 3) {
      return 'border-2 border-yellow-400 bg-yellow-50';
    }
    return 'border border-border';
  };

  const sortedLeaderboard = getSortedLeaderboard();
  const currentUserRank = sortedLeaderboard.findIndex(entry => entry.isCurrentUser) + 1;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FF3000]" />
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Leaderboard</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Your Rank: #{currentUserRank}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['xp', 'compliance', 'streak'] as LeaderboardTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#FF3000] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab === 'xp' ? 'XP' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {sortedLeaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${getRankStyle(index + 1, entry.isCurrentUser)}`}
          >
            {/* Rank */}
            <div className="flex-shrink-0">
              {getRankIcon(index + 1)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p style={{ fontSize: '13px', fontWeight: 600 }} className="truncate">
                  {entry.name}
                </p>
                {entry.isCurrentUser && (
                  <span className="px-2 py-0.5 bg-[#FF3000] text-white text-xs rounded-full">You</span>
                )}
              </div>
              <p style={{ fontSize: '11px', color: '#6B7280' }} className="truncate">
                {entry.company}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-right">
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#FF3000' }}>
                  {activeTab === 'xp' ? `${entry.xp.toLocaleString()} XP` : 
                   activeTab === 'compliance' ? `${entry.complianceScore}%` :
                   `${entry.streak} days`}
                </p>
                <p style={{ fontSize: '11px', color: '#6B7280' }}>
                  Level {entry.level}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <button className="w-full mt-4 px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm">
        View Full Leaderboard
      </button>
    </div>
  );
}