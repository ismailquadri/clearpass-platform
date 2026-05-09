import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Palette,
  Download,
  Upload,
  Save,
} from 'lucide-react';
import { useState } from 'react';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<'company' | 'notifications' | 'preferences' | 'security'>(
    'company'
  );

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2" style={{ fontSize: '32px' }}>Settings</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Manage your company profile, notifications, and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                style={
                  activeTab === tab.id
                    ? { borderColor: 'rgb(251, 115, 25)' }
                    : {}
                }
              >
                <Icon className="w-5 h-5" />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Company Profile Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Company Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="TechBuild Nigeria Ltd"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    RC Number
                  </label>
                  <input
                    type="text"
                    defaultValue="RC1234567"
                    disabled
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md opacity-60"
                  />
                  <p className="caption text-muted-foreground mt-1">
                    RC number cannot be changed
                  </p>
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Industry Sector
                  </label>
                  <select className="w-full px-4 py-2 bg-input-background border border-border rounded-md">
                    <option>Construction & Engineering</option>
                    <option>Information Technology</option>
                    <option>Professional Services</option>
                    <option>Manufacturing</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Number of Employees
                  </label>
                  <select className="w-full px-4 py-2 bg-input-background border border-border rounded-md" defaultValue="11-50">
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500+</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Registered Address
                  </label>
                  <input
                    type="text"
                    defaultValue="23 Adeola Odeku Street, Victoria Island, Lagos"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Primary Contact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Amaka Okoro"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Position
                  </label>
                  <input
                    type="text"
                    defaultValue="Compliance Manager"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="amaka@techbuild.ng"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+234 803 123 4567"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-6 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-md text-white flex items-center gap-2"
                style={{ backgroundColor: 'rgb(251, 115, 25)' }}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'Certificate Expiry Alerts',
                    description: 'Get notified 30, 14, and 7 days before certificate expiry',
                    enabled: true,
                  },
                  {
                    label: 'Compliance Score Changes',
                    description: 'Receive alerts when your compliance score changes significantly',
                    enabled: true,
                  },
                  {
                    label: 'Verification Status Updates',
                    description: 'Get updates when certificates are verified or approved',
                    enabled: true,
                  },
                  {
                    label: 'Weekly Summary',
                    description: 'Receive a weekly email summary of your compliance status',
                    enabled: false,
                  },
                  {
                    label: 'Product Updates',
                    description: 'Stay informed about new features and platform updates',
                    enabled: true,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</p>
                      <p className="caption text-muted-foreground">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.enabled}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: item.enabled
                            ? 'rgb(251, 115, 25)'
                            : 'rgb(209, 209, 209)',
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                SMS Notifications
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'Critical Expiry Alerts',
                    description: 'SMS alerts for certificates expiring within 7 days',
                    enabled: true,
                  },
                  {
                    label: 'Score Drop Warnings',
                    description: 'SMS when compliance score drops below 60',
                    enabled: true,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</p>
                      <p className="caption text-muted-foreground">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.enabled}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: item.enabled
                            ? 'rgb(251, 115, 25)'
                            : 'rgb(209, 209, 209)',
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-6 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-md text-white flex items-center gap-2"
                style={{ backgroundColor: 'rgb(251, 115, 25)' }}
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Display Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Theme
                  </label>
                  <select className="w-full max-w-xs px-4 py-2 bg-input-background border border-border rounded-md">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Date Format
                  </label>
                  <select className="w-full max-w-xs px-4 py-2 bg-input-background border border-border rounded-md">
                    <option>DD MMM YYYY (09 May 2026)</option>
                    <option>MM/DD/YYYY (05/09/2026)</option>
                    <option>YYYY-MM-DD (2026-05-09)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Language
                  </label>
                  <select className="w-full max-w-xs px-4 py-2 bg-input-background border border-border rounded-md">
                    <option>English</option>
                    <option>Yoruba</option>
                    <option>Hausa</option>
                    <option>Igbo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Data & Privacy
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>
                      <Download className="w-4 h-4 inline mr-2" />
                      Download My Data
                    </p>
                    <p className="caption text-muted-foreground">
                      Export all your company data and compliance records
                    </p>
                  </div>
                </button>
                <button className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>
                      <Upload className="w-4 h-4 inline mr-2" />
                      Import Data
                    </p>
                    <p className="caption text-muted-foreground">
                      Import compliance data from another system
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Account Security
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left">
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Change Password</p>
                  <p className="caption text-muted-foreground">
                    Last changed 45 days ago
                  </p>
                </button>
                <button className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left">
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    Two-Factor Authentication
                  </p>
                  <p className="caption text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </button>
                <button className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left">
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Active Sessions</p>
                  <p className="caption text-muted-foreground">
                    View and manage your active login sessions
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                API Access
              </h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
                Generate API keys to integrate ClearPass with your systems
              </p>
              <button
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: 'rgb(251, 115, 25)' }}
              >
                Generate API Key
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
