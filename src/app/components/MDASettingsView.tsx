import { useState } from 'react';
import { User, Mail, Phone, Bell, Shield, Save, Key, Building2 } from 'lucide-react';
import { useToast } from './ToastProvider';
import { useAuth } from '../context/AuthContext';
import '../../app/styles/mda-theme.css';

export function MDASettingsView() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name ?? 'Dr. Bello Adamu',
    email: user?.email ?? 'bello.adamu@nhia.gov.ng',
    phone: user?.phone ?? '+2348023456789',
    department: 'Compliance Verification Division',
    agency: user?.mdaName ?? 'National Health Insurance Authority',
    staffId: 'NHIA/CVD/2026/047',
  });

  const [notifications, setNotifications] = useState({
    vendorFlagged: true,
    certExpirySoon: true,
    bulkComplete: true,
    weeklyDigest: false,
    smsAlerts: true,
  });

  const tabs = [
    { id: 'profile' as const, label: 'Agency Profile', icon: Building2 },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
    showToast('success', 'Profile Saved', 'Your agency profile has been updated.');
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
    showToast('success', 'Preferences Saved', 'Notification preferences updated.');
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="cp-page-title">Settings</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: '15px' }}>
            Manage your NHIA officer profile and portal preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-sm font-medium"
                style={active
                  ? { borderColor: 'var(--mda-primary)', color: 'var(--mda-primary)' }
                  : { borderColor: 'transparent', color: undefined }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-5" style={{ fontSize: '16px' }}>Officer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium">
                    <User className="w-4 h-4 inline mr-1.5 text-muted-foreground" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-input-background"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">
                    <Key className="w-4 h-4 inline mr-1.5 text-muted-foreground" />
                    Staff ID
                  </label>
                  <input
                    type="text"
                    value={profile.staffId}
                    disabled
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted opacity-60"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">
                    <Mail className="w-4 h-4 inline mr-1.5 text-muted-foreground" />
                    Government Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-input-background"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">
                    <Phone className="w-4 h-4 inline mr-1.5 text-muted-foreground" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-input-background"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">
                    <Building2 className="w-4 h-4 inline mr-1.5 text-muted-foreground" />
                    Agency
                  </label>
                  <input
                    type="text"
                    value={profile.agency}
                    disabled
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted opacity-60"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">Department</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-input-background"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => void handleSaveProfile()}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--mda-primary)', fontSize: '14px' }}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-5" style={{ fontSize: '16px' }}>Alert Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'vendorFlagged' as const, label: 'Vendor flagged as ineligible', desc: 'Alert when a watchlisted vendor becomes non-compliant' },
                  { key: 'certExpirySoon' as const, label: 'Certificate expiring within 30 days', desc: 'For vendors on your active watchlist' },
                  { key: 'bulkComplete' as const, label: 'Bulk verification complete', desc: 'Notify when a CSV batch finishes processing' },
                  { key: 'weeklyDigest' as const, label: 'Weekly verification digest', desc: 'Summary of all verifications performed in the week' },
                  { key: 'smsAlerts' as const, label: 'SMS alerts', desc: 'Receive critical alerts via SMS to registered phone' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium" style={{ fontSize: '14px' }}>{item.label}</p>
                      <p className="text-muted-foreground mt-0.5" style={{ fontSize: '12px' }}>{item.desc}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={notifications[item.key]}
                      onClick={() => setNotifications((p) => ({ ...p, [item.key]: !p[item.key] }))}
                      className="relative w-10 h-5 rounded-full transition-colors shrink-0 ml-6"
                      style={{ backgroundColor: notifications[item.key] ? 'var(--mda-primary)' : '#d1d5db' }}
                    >
                      <span
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                        style={{ transform: notifications[item.key] ? 'translateX(20px)' : 'translateX(0)' }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => void handleSaveNotifications()}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: 'var(--mda-primary)', fontSize: '14px' }}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}

        {/* Security tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-2" style={{ fontSize: '16px' }}>Change Password</h2>
              <p className="text-muted-foreground mb-5" style={{ fontSize: '13px' }}>
                Use a strong password unique to this government portal.
              </p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block mb-1.5 text-sm font-medium">Current Password</label>
                  <input type="password" className="w-full px-4 py-2.5 border border-border rounded-lg bg-input-background" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">New Password</label>
                  <input type="password" className="w-full px-4 py-2.5 border border-border rounded-lg bg-input-background" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-2.5 border border-border rounded-lg bg-input-background" placeholder="••••••••" />
                </div>
                <button
                  onClick={() => showToast('success', 'Password Updated', 'Your password has been changed.')}
                  className="px-6 py-2.5 rounded-lg text-white font-medium hover:opacity-90"
                  style={{ backgroundColor: 'var(--mda-primary)', fontSize: '14px' }}
                >
                  Update Password
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-2" style={{ fontSize: '16px' }}>Two-Factor Authentication</h2>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '13px' }}>
                MFA is <strong>required</strong> for all NHIA portal accounts. Your account has MFA enabled via SMS OTP.
              </p>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{ backgroundColor: 'var(--mda-bg-light)', border: '1px solid var(--mda-border-light)' }}
              >
                <Shield className="w-5 h-5 shrink-0" style={{ color: 'var(--mda-primary)' }} />
                <p style={{ fontSize: '13px', color: 'var(--mda-primary)', fontWeight: 500 }}>
                  MFA Active — SMS OTP to {profile.phone}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-2" style={{ fontSize: '16px' }}>Active Sessions</h2>
              <div className="space-y-3">
                {[
                  { device: 'Chrome on macOS', ip: '197.210.54.102', location: 'Abuja, Nigeria', current: true, time: 'Now' },
                  { device: 'Safari on iPhone', ip: '197.210.54.110', location: 'Abuja, Nigeria', current: false, time: '2 hrs ago' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium" style={{ fontSize: '13px' }}>{s.device}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                        {s.ip} · {s.location} · {s.time}
                      </p>
                    </div>
                    {s.current
                      ? <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--mda-bg-light)', color: 'var(--mda-primary)' }}>Current</span>
                      : <button onClick={() => showToast('info', 'Session Revoked', 'That device has been signed out.')} className="text-red-500 hover:text-red-600 text-xs font-medium">Revoke</button>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
