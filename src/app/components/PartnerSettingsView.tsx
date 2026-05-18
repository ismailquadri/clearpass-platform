import { User, Bell, Shield, CreditCard, LogOut, Save } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

export function PartnerSettingsView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing'>(
    'profile'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('success', 'Settings Saved', 'Your changes have been saved successfully');
    }, 1000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="cp-page-title">Settings</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Manage your partner account settings and preferences
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-card border border-border rounded-lg p-2 space-y-1">
              <SettingsNavButton
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
                icon={User}
                label="Profile"
              />
              <SettingsNavButton
                active={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
                icon={Bell}
                label="Notifications"
              />
              <SettingsNavButton
                active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
                icon={Shield}
                label="Security"
              />
              <SettingsNavButton
                active={activeTab === 'billing'}
                onClick={() => setActiveTab('billing')}
                icon={CreditCard}
                label="Billing"
              />
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'billing' && <BillingSettings />}

              <div className="mt-6 pt-6 border-t border-border flex justify-end gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 min-h-[44px] rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: '#FF3000' }}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingsNavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: typeof User;
  label: string;
}

function SettingsNavButton({ active, onClick, icon: Icon, label }: SettingsNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors min-h-[48px] ${
        active
          ? 'bg-[#ffe6e6] text-[#FF3000] dark:bg-[#3a1010] dark:text-[#ff6b6b]'
          : 'hover:bg-muted text-foreground'
      }`}
      style={{
        fontSize: '14px',
        fontWeight: active ? 500 : 400,
      }}
    >
      <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '2px' }}>Profile Settings</h3>
        <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
          Update your personal information and contact details
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first-name"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              defaultValue="Chisom"
              className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              defaultValue="Okafor"
              className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            defaultValue="chisom.okafor@example.com"
            className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-2"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            defaultValue="+234 801 234 5678"
            className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block mb-2"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            Company Name
          </label>
          <input
            id="company"
            type="text"
            defaultValue="Compliance Consultants Ltd"
            className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '2px' }}>
          Notification Preferences
        </h3>
        <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
          Choose how you want to receive alerts and updates
        </p>
      </div>

      <div className="space-y-4">
        <NotificationToggle
          label="Email Notifications"
          description="Receive email alerts for client compliance updates"
          defaultChecked={true}
        />
        <NotificationToggle
          label="SMS Notifications"
          description="Receive SMS alerts for critical compliance issues"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Weekly Digest Email"
          description="Receive weekly summary of all client activities (Mondays 8:00 AM WAT)"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Certificate Expiry Alerts"
          description="Get notified when client certificates are expiring"
          defaultChecked={true}
        />
        <NotificationToggle
          label="New Client Invitations"
          description="Get notified when clients accept your invitations"
          defaultChecked={true}
        />
      </div>
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function NotificationToggle({
  label,
  description,
  defaultChecked = false,
}: NotificationToggleProps) {
  return (
    <label className="flex items-start justify-between p-4 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors">
      <div className="flex-1">
        <p style={{ fontSize: '14px', fontWeight: 500 }}>{label}</p>
        <p className="caption text-muted-foreground mt-1">{description}</p>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-5 h-5 rounded accent-[#FF3000] mt-1 ml-4"
      />
    </label>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '2px' }}>
          Security Settings
        </h3>
        <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
          Manage your account security and access preferences
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="current-password"
            className="block mb-2"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="new-password"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        <NotificationToggle
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          defaultChecked={false}
        />

        <div className="p-4 bg-muted rounded-md">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <p style={{ fontSize: '14px', fontWeight: 500 }}>Last Login</p>
          </div>
          <p className="caption text-muted-foreground">Today at 9:30 AM WAT from Lagos, Nigeria</p>
        </div>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '2px' }}>
          Billing & Subscription
        </h3>
        <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
          Manage your subscription and payment methods
        </p>
      </div>

      <div className="p-4 bg-muted rounded-md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>Professional Plan</p>
            <p className="caption text-muted-foreground">Up to 50 clients</p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)', color: '#FF3000' }}
          >
            Active
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500 }}>₦25,000/month</p>
            <p className="caption text-muted-foreground">Next billing: Feb 15, 2026</p>
          </div>
          <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm">
            Upgrade Plan
          </button>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '3' }}>Payment Method</h4>
        <div className="p-4 bg-muted rounded-md">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Visa ending in 4242</p>
              <p className="caption text-muted-foreground">Expires 12/2027</p>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full px-4 py-2 min-h-[44px] rounded-md border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" />
        Cancel Subscription
      </button>
    </div>
  );
}
