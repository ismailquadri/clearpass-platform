/**
 * Recharts-only subtree, lazy-loaded by PartnerAnalyticsView.
 *
 * Living in a separate module means recharts (heavy) ships in its own
 * chunk and is only fetched when the user actually opens analytics.
 */

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
import type { PartnerAnalytics } from '../api';

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
} as const;

const AXIS_STYLE = { fontSize: '12px' } as const;

export function PartnerAnalyticsCharts({
  analytics,
}: {
  analytics: PartnerAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                style={AXIS_STYLE}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                style={AXIS_STYLE}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF3000"
                strokeWidth={2}
                dot={{ fill: '#FF3000', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Client Compliance Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.complianceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.complianceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 sm:gap-6 mt-3 flex-wrap">
            {analytics.complianceDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="caption">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Certificate Expiry Timeline">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.expiryTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="period"
                stroke="var(--muted-foreground)"
                style={AXIS_STYLE}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                style={AXIS_STYLE}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#FF3000" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Renewals by Certificate Type (This Month)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.certificateTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                stroke="var(--muted-foreground)"
                style={AXIS_STYLE}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--muted-foreground)"
                style={AXIS_STYLE}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar
                dataKey="renewals"
                fill="#FF3000"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
