import {
  User,
  Mail,
  Phone,
  Building2,
  LogOut,
  Copy,
  Share2,
  Gift,
  Users,
  Crown,
  Settings,
  X,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';
import '../../app/styles/mda-theme.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: 'Business' | 'MDA' | 'Partner';
  userProfile: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    role?: string;
    avatar?: string;
  };
  onLogout: () => void;
}

interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  rewardsEarned: number;
  referralBonus: number;
}

export function ProfileModal({
  isOpen,
  onClose,
  persona,
  userProfile,
  onLogout
}: ProfileModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'referral'>('profile');
  const [copiedCode, setCopiedCode] = useState(false);

  const primaryColor = persona === 'MDA' ? 'var(--mda-primary)' : '#FF3000';
  const primaryColorLight = persona === 'MDA' ? 'var(--mda-bg-light)' : 'rgba(255, 48, 0, 0.1)';

  // Mock referral data - in real implementation, this would come from the backend
  const referralData: ReferralData = {
    referralCode: 'CLEARPASS-' + userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() + '2026',
    referralLink: `https://clearpass.com/invite?ref=${userProfile.name.split(' ').map(n => n[0]).join('').toLowerCase()}2026`,
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    rewardsEarned: 24000,
    referralBonus: 3000,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopiedCode(true);
    showToast('success', 'Copied!', 'Referral code copied to clipboard');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    showToast('success', 'Copied!', 'Referral link copied to clipboard');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ClearPass',
          text: `Join ClearPass and streamline your compliance management. Use my referral code: ${referralData.referralCode}`,
          url: referralData.referralLink,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  const showReferralTab = persona === 'Business' || persona === 'Partner';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        {showReferralTab && (
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'border-b-2'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                color: activeTab === 'profile' ? primaryColor : undefined,
                borderColor: activeTab === 'profile' ? primaryColor : undefined
              }}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('referral')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'referral'
                  ? 'border-b-2'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                color: activeTab === 'referral' ? primaryColor : undefined,
                borderColor: activeTab === 'referral' ? primaryColor : undefined
              }}
            >
              Referral Program
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: primaryColor }}>
                  {userProfile.avatar || userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                  {userProfile.role && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3 h-3" />
                      {userProfile.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">{userProfile.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                  </div>
                </div>

                {userProfile.phone && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
                    </div>
                  </div>
                )}

                {userProfile.company && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">{userProfile.company}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    showToast('info', 'Settings', 'Settings panel would open here');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'referral' && (
            <div className="space-y-6">
              {/* Referral Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4 text-white" style={{
                  background: persona === 'MDA' 
                    ? 'var(--mda-gradient-primary)' 
                    : 'linear-gradient(to bottom right, #FF3000, #e62e00)'
                }}>
                  <Gift className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">₦{referralData.rewardsEarned.toLocaleString()}</p>
                  <p className="text-sm opacity-80">Total Earned</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                  <Users className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{referralData.successfulReferrals}</p>
                  <p className="text-sm opacity-80">Successful Referrals</p>
                </div>
              </div>

              {/* Referral Code */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Referral Code</span>
                  <Crown className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background px-3 py-2 rounded text-sm font-mono">
                    {referralData.referralCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 hover:bg-background rounded-md transition-colors"
                    title="Copy code"
                  >
                    {copiedCode ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-muted rounded-lg p-4">
                <span className="text-sm font-medium block mb-2">Your Referral Link</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralData.referralLink}
                    readOnly
                    className="flex-1 bg-background px-3 py-2 rounded text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 hover:bg-background rounded-md transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                <Share2 className="w-5 h-5" />
                Share Referral Link
              </button>

              {/* Referral Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Share your referral code or link with others</li>
                  <li>• Earn ₦{referralData.referralBonus.toLocaleString()} for each successful signup</li>
                  <li>• Get credited when they complete their first compliance verification</li>
                  <li>• Track your referrals and earnings in real-time</li>
                </ul>
              </div>

              {/* Referral Stats Details */}
              <div className="space-y-3">
                <h4 className="font-medium">Referral Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm">Total Referrals</span>
                    <span className="font-semibold">{referralData.totalReferrals}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm text-green-800">Successful</span>
                    <span className="font-semibold text-green-800">{referralData.successfulReferrals}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-sm text-yellow-800">Pending</span>
                    <span className="font-semibold text-yellow-800">{referralData.pendingReferrals}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}