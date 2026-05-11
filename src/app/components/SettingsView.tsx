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
import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

export function SettingsView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'company' | 'team' | 'notifications' | 'preferences' | 'security'
  >('company');

  // Form state
  const [formData, setFormData] = useState({
    companyName: 'ClearPass Industries',
    email: 'info@clearpass.com',
    phone: '+234 801 234 5678',
    address: '123 Business District, Lagos',
    taxId: '12345678-0001',
    website: 'https://clearpass.com',
    sector: 'ICT',
    employeeBand: '11-50',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [teamMembers] = useState([
    { id: 't1', name: 'Amaka Okoro', email: 'amaka@techventures.ng', role: 'Admin', status: 'active' as const },
    { id: 't2', name: 'Chidi Obi', email: 'chidi@techventures.ng', role: 'Viewer', status: 'active' as const },
    { id: 't3', name: 'Ngozi Eze', email: 'ngozi@techventures.ng', role: 'Editor', status: 'pending' as const },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');
  const [certAlerts, setCertAlerts] = useState({
    nhia: true, pcc: true, nsitf: true, firs: true, bpp: false, itf: false,
  });
  const [alertChannels, setAlertChannels] = useState({
    email: true, sms: false, inApp: true,
  });
  const shareableLink = 'https://clearpass.com.ng/verify/RC1234567?token=abc123xyz';

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('clearpass_settings_form');
    if (savedData) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(() => JSON.parse(savedData));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save form data on change
  useEffect(() => {
    localStorage.setItem('clearpass_settings_form', JSON.stringify(formData));
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Company name validation (required)
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    // Email validation (required + format)
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (required)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('error', 'Validation Error', 'Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('success', 'Changes Saved', 'Company profile updated successfully');
      // Clear auto-saved data after successful save
      localStorage.removeItem('clearpass_settings_form');
    } catch {
      showToast('error', 'Save Failed', 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('success', 'Notifications Saved', 'Notification preferences updated successfully');
    } catch {
      showToast(
        'error',
        'Save Failed',
        'Failed to save notification preferences. Please try again.'
      );
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'team', label: 'Team', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2" style={{ fontSize: '32px' }}>
            Settings
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Manage your company profile, notifications, and preferences
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 mb-6 border-b border-border"
          role="tablist"
          aria-label="Settings sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                style={activeTab === tab.id ? { borderColor: '#FF3000' } : {}}
              >
                <Icon className="w-5 h-5" />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Company Profile Tab */}
        {activeTab === 'company' && (
          <div
            role="tabpanel"
            id="company-panel"
            aria-labelledby="company-tab"
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Company Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="company-name"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Company Name{' '}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                    aria-invalid={!!errors.companyName}
                    aria-describedby={errors.companyName ? 'company-name-error' : undefined}
                    className={`w-full px-4 py-2 bg-input-background border rounded-md ${
                      errors.companyName ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.companyName && (
                    <p
                      id="company-name-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errors.companyName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="rc-number"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    RC Number
                  </label>
                  <input
                    id="rc-number"
                    type="text"
                    defaultValue="RC1234567"
                    disabled
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md opacity-60"
                  />
                  <p className="caption text-muted-foreground mt-1">RC number cannot be changed</p>
                </div>
                <div>
                  <label
                    htmlFor="industry-sector"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Industry Sector
                  </label>
                  <select
                    id="industry-sector"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  >
                    <option>Construction & Engineering</option>
                    <option>Information Technology</option>
                    <option>Professional Services</option>
                    <option>Manufacturing</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="number-of-employees"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Number of Employees
                  </label>
                  <select
                    id="number-of-employees"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                    defaultValue="11-50"
                  >
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500+</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="registered-address"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Registered Address
                  </label>
                  <input
                    id="registered-address"
                    type="text"
                    defaultValue="23 Adeola Odeku Street, Victoria Island, Lagos"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Primary Contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="full-name"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    defaultValue="Amaka Okoro"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="position"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Position
                  </label>
                  <input
                    id="position"
                    type="text"
                    defaultValue="Compliance Manager"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email-address"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address{' '}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="email-address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-address-error' : undefined}
                    className={`w-full px-4 py-2 bg-input-background border rounded-md ${
                      errors.email ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="email-address-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone-number"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number{' '}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-number-error' : undefined}
                    className={`w-full px-4 py-2 bg-input-background border rounded-md ${
                      errors.phone ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.phone && (
                    <p
                      id="phone-number-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => showToast('info', 'Cancelled', 'Changes have been discarded')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                aria-live="polite"
                aria-busy={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#FF3000' }}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Team Management Tab */}
        {activeTab === 'team' && (
          <div role="tabpanel" id="team-panel" aria-labelledby="team-tab" className="space-y-6">
            {/* Invite member */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>Invite Team Member</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.ng"
                  className="flex-1 px-4 py-2.5 border border-border rounded-md bg-input-background"
                  style={{ fontSize: '14px' }}
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="px-3 py-2.5 border border-border rounded-md bg-input-background"
                  style={{ fontSize: '14px' }}
                >
                  <option>Viewer</option>
                  <option>Editor</option>
                  <option>Admin</option>
                </select>
                <button
                  onClick={() => {
                    if (!inviteEmail.trim()) return;
                    showToast('success', 'Invite Sent', `Invitation sent to ${inviteEmail}`);
                    setInviteEmail('');
                  }}
                  className="px-5 py-2.5 min-h-[44px] rounded-md text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
                  style={{ backgroundColor: '#FF3000', fontSize: '14px' }}
                >
                  Send Invite
                </button>
              </div>
              <p className="text-muted-foreground mt-2" style={{ fontSize: '13px' }}>
                Viewer: read-only · Editor: can upload certs · Admin: full access
              </p>
            </div>

            {/* Member list */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>Team Members</h2>
              <div className="space-y-3">
                {teamMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF3000] flex items-center justify-center text-white shrink-0" style={{ fontSize: '12px', fontWeight: 700 }}>
                        {m.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500 }}>{m.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '11px', backgroundColor: m.status === 'pending' ? '#fef3c7' : '#dcfce7', color: m.status === 'pending' ? '#F59E0B' : '#1FC16B', fontWeight: 500 }}>
                        {m.status === 'pending' ? 'Pending' : m.role}
                      </span>
                      {m.status === 'active' && (
                        <button
                          onClick={() => showToast('info', 'Removed', `${m.name} removed from team`)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          style={{ fontSize: '12px' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shareable compliance link */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 className="mb-2" style={{ fontSize: '18px', fontWeight: 500 }}>Shareable Compliance Link</h2>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '14px' }}>
                Share this link with MDAs to let them verify your compliance status without logging in.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  readOnly
                  value={shareableLink}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-muted/30 text-muted-foreground"
                  style={{ fontSize: '13px' }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareableLink).catch(() => {});
                    showToast('success', 'Copied', 'Shareable link copied to clipboard');
                  }}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors w-full sm:w-auto"
                  style={{ fontSize: '13px' }}
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Data deletion */}
            <div className="bg-card border border-red-200 rounded-lg p-4 sm:p-6">
              <h2 className="mb-2 text-red-600" style={{ fontSize: '18px', fontWeight: 500 }}>Danger Zone</h2>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
                Requesting data deletion will remove all certificates, reports, and company data permanently after a 30-day grace period.
              </p>
              <button
                onClick={() => showToast('info', 'Request Submitted', 'A data deletion request has been submitted. Our team will contact you within 2 business days.')}
                className="px-4 py-2.5 min-h-[44px] rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                style={{ fontSize: '14px' }}
              >
                Request Data Deletion
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div
            role="tabpanel"
            id="notifications-panel"
            aria-labelledby="notifications-tab"
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Email Notifications
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: 'Certificate Expiry Alerts',
                    description: 'Get notified 30, 14, and 7 days before certificate expiry',
                    enabled: true,
                    id: 'cert-expiry-alerts',
                  },
                  {
                    label: 'Compliance Score Changes',
                    description: 'Receive alerts when your compliance score changes significantly',
                    enabled: true,
                    id: 'score-changes',
                  },
                  {
                    label: 'Verification Status Updates',
                    description: 'Get updates when certificates are verified or approved',
                    enabled: true,
                    id: 'verification-updates',
                  },
                  {
                    label: 'Weekly Summary',
                    description: 'Receive a weekly email summary of your compliance status',
                    enabled: false,
                    id: 'weekly-summary',
                  },
                  {
                    label: 'Product Updates',
                    description: 'Stay informed about new features and platform updates',
                    enabled: true,
                    id: 'product-updates',
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
                    <label
                      htmlFor={item.id}
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        id={item.id}
                        type="checkbox"
                        defaultChecked={item.enabled}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: item.enabled ? '#FF3000' : 'rgb(209, 209, 209)',
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                SMS Notifications
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: 'Critical Expiry Alerts',
                    description: 'SMS alerts for certificates expiring within 7 days',
                    enabled: true,
                    id: 'critical-expiry-sms',
                  },
                  {
                    label: 'Score Drop Warnings',
                    description: 'SMS when compliance score drops below 60',
                    enabled: true,
                    id: 'score-drop-sms',
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
                    <label
                      htmlFor={item.id}
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        id={item.id}
                        type="checkbox"
                        defaultChecked={item.enabled}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: item.enabled ? '#FF3000' : 'rgb(209, 209, 209)',
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-cert alert routing */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>Per-Certificate Alerts</h2>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '14px' }}>Choose which certificates trigger expiry notifications.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(certAlerts) as Array<keyof typeof certAlerts>).map((cert) => (
                  <label key={cert} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certAlerts[cert]}
                      onChange={() => setCertAlerts((prev) => ({ ...prev, [cert]: !prev[cert] }))}
                      className="w-4 h-4 accent-[#FF3000]"
                    />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{cert.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Channel routing */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>Alert Channels</h2>
              <div className="space-y-3">
                {([
                  { key: 'email', label: 'Email notifications' },
                  { key: 'sms', label: 'SMS notifications (₦2/alert)' },
                  { key: 'inApp', label: 'In-app notifications' },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span style={{ fontSize: '14px' }}>{label}</span>
                    <div
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${alertChannels[key] ? 'bg-[#FF3000]' : 'bg-muted'}`}
                      onClick={() => setAlertChannels((prev) => ({ ...prev, [key]: !prev[key] }))}
                      role="switch"
                      aria-checked={alertChannels[key]}
                      tabIndex={0}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${alertChannels[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => showToast('info', 'Cancelled', 'Changes have been discarded')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotifications}
                disabled={isSavingNotifications}
                aria-live="polite"
                aria-busy={isSavingNotifications}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#FF3000' }}
              >
                <Save className="w-4 h-4" />
                {isSavingNotifications ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div
            role="tabpanel"
            id="preferences-panel"
            aria-labelledby="preferences-tab"
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Display Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="theme"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Theme
                  </label>
                  <select
                    id="theme"
                    className="w-full max-w-xs px-4 py-2 bg-input-background border border-border rounded-md"
                  >
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="date-format"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Date Format
                  </label>
                  <select
                    id="date-format"
                    className="w-full max-w-xs px-4 py-2 bg-input-background border border-border rounded-md"
                  >
                    <option>DD MMM YYYY (09 May 2026)</option>
                    <option>MM/DD/YYYY (05/09/2026)</option>
                    <option>YYYY-MM-DD (2026-05-09)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="language"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    className="w-full max-w-xs px-4 py-2 bg-input-background border border-border rounded-md"
                  >
                    <option>English</option>
                    <option>Yoruba</option>
                    <option>Hausa</option>
                    <option>Igbo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Data & Privacy
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    showToast('success', 'Data Export', 'Preparing your data for download...')
                  }
                  className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left flex items-center justify-between"
                >
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
                <button
                  onClick={() => showToast('success', 'Data Import', 'Opening data import form...')}
                  className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left flex items-center justify-between"
                >
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
          <div
            role="tabpanel"
            id="security-panel"
            aria-labelledby="security-tab"
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                Account Security
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    showToast('success', 'Change Password', 'Opening password change form...')
                  }
                  className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
                >
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Change Password</p>
                  <p className="caption text-muted-foreground">Last changed 45 days ago</p>
                </button>
                <button
                  onClick={() =>
                    showToast('success', 'Two-Factor Authentication', 'Opening 2FA setup wizard...')
                  }
                  className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
                >
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Two-Factor Authentication</p>
                  <p className="caption text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </button>
                <button
                  onClick={() =>
                    showToast('success', 'Active Sessions', 'Opening session management...')
                  }
                  className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
                >
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Active Sessions</p>
                  <p className="caption text-muted-foreground">
                    View and manage your active login sessions
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
                API Access
              </h2>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
                Generate API keys to integrate ClearPass with your systems
              </p>
              <button
                onClick={() =>
                  showToast('success', 'API Key Generated', 'Your new API key has been generated')
                }
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: '#FF3000' }}
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
