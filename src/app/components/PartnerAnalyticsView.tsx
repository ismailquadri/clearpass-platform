import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function PartnerAnalyticsView() {
  // Revenue trend data
  const revenueData = [
    { month: 'Nov', revenue: 185000, clients: 18 },
    { month: 'Dec', revenue: 210000, clients: 21 },
    { month: 'Jan', revenue: 235000, clients: 23 },
    { month: 'Feb', revenue: 255000, clients: 24 },
    { month: 'Mar', revenue: 245000, clients: 23 },
    { month: 'Apr', revenue: 275000, clients: 25 },
  ];

  // Client compliance distribution
  const complianceDistribution = [
    { name: 'Healthy', value: 12, color: 'rgb(31, 193, 107)' },
    { name: 'Attention', value: 8, color: 'rgb(250, 115, 25)' },
    { name: 'Critical', value: 5, color: 'rgb(251, 55, 72)' },
  ];

  // Certificate expiry timeline
  const expiryTimeline = [
    { period: 'Next 7 days', count: 8 },
    { period: '8-14 days', count: 12 },
    { period: '15-30 days', count: 15 },
    { period: '31-60 days', count: 22 },
    { period: '60+ days', count: 35 },
  ];

  // Certificate types breakdown
  const certificateTypes = [
    { name: 'NHIA', renewals: 6 },
    { name: 'PCC', renewals: 8 },
    { name: 'NSITF', renewals: 5 },
    { name: 'FIRS', renewals: 7 },
    { name: 'BPP', renewals: 4 },
    { name: 'ITF', renewals: 3 },
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2" style={{ fontSize: '32px' }}>
            Analytics
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Track client performance, revenue trends, and compliance metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Monthly Revenue
              </span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>₦275k</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="caption text-green-600">+12% from last month</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Active Clients
              </span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>25</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="caption text-green-600">+4 this month</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Avg Compliance Score
              </span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>78</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="caption text-red-600">-3 from last month</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Renewals This Month
              </span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>33</p>
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="caption text-orange-600">8 pending action</span>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="rgb(251, 115, 25)"
                  strokeWidth={2}
                  dot={{ fill: 'rgb(251, 115, 25)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Client Compliance Distribution */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
              Client Compliance Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complianceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {complianceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="caption">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6">
          {/* Certificate Expiry Timeline */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
              Certificate Expiry Timeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expiryTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="period"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="rgb(71, 194, 255)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Renewals by Certificate Type */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
              Renewals by Certificate Type (This Month)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={certificateTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="renewals" fill="rgb(250, 115, 25)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
            Key Insights
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div
              className="px-4 py-3 rounded-lg border border-[#e5e5e5]"
              style={{ backgroundColor: 'rgb(31, 193, 107, 0.1)' }}
            >
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'rgb(31, 193, 107)' }}>
                Strong Growth
              </p>
              <p className="caption text-muted-foreground mt-1">
                Revenue increased 12% this month with 4 new client acquisitions
              </p>
            </div>
            <div
              className="px-4 py-3 rounded-lg border border-[#e5e5e5]"
              style={{ backgroundColor: 'rgb(250, 115, 25, 0.1)' }}
            >
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'rgb(250, 115, 25)' }}>
                Action Required
              </p>
              <p className="caption text-muted-foreground mt-1">
                8 certificates expiring in next 7 days require immediate attention
              </p>
            </div>
            <div
              className="px-4 py-3 rounded-lg border border-[#e5e5e5]"
              style={{ backgroundColor: 'rgb(71, 194, 255, 0.1)' }}
            >
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'rgb(71, 194, 255)' }}>
                Client Focus
              </p>
              <p className="caption text-muted-foreground mt-1">
                PCC renewals are highest this month - consider proactive outreach
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
