import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { 
  Building2, 
  TrendingUp, 
  UserPlus, 
  Users, 
  Activity, 
  Briefcase,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface UsageSummary {
  dau: number;
  wau: number;
  mau: number;
  dau_yesterday: number;
  wau_last_week: number;
  mau_last_month: number;
  active_workspaces_today: number;
  total_activities_today: number;
  new_signups_today: number;
  new_signups_this_week: number;
  new_signups_this_month: number;
}

interface UsageMetric {
  metric_date: string;
  daily_active_users: number;
  new_signups: number;
  active_workspaces: number;
  total_activities: number;
  jobs_created: number;
  applications_received: number;
}

export function GrowthSection() {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [metrics, setMetrics] = useState<UsageMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    fetchUsageData();
  }, [timeRange]);

  async function fetchUsageData() {
    try {
      setLoading(true);
      
      const [summaryRes, metricsRes] = await Promise.all([
        supabase.rpc('get_admin_usage_summary'),
        supabase.rpc('get_admin_usage_metrics', { days_back: timeRange })
      ]);

      if (summaryRes.error) throw summaryRes.error;
      if (metricsRes.error) throw metricsRes.error;

      setSummary(summaryRes.data);
      setMetrics((metricsRes.data || []).reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  }

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Active Users" 
          value={summary?.dau.toLocaleString() || '0'}
          trend={calculateTrend(summary?.dau || 0, summary?.dau_yesterday || 0)}
          trendLabel="vs yesterday"
          icon={Users} 
          color="indigo" 
        />
        <StatCard 
          title="Weekly Active Users" 
          value={summary?.wau.toLocaleString() || '0'}
          trend={calculateTrend(summary?.wau || 0, summary?.wau_last_week || 0)}
          trendLabel="vs last week"
          icon={TrendingUp} 
          color="emerald" 
        />
        <StatCard 
          title="Monthly Active Users" 
          value={summary?.mau.toLocaleString() || '0'}
          trend={calculateTrend(summary?.mau || 0, summary?.mau_last_month || 0)}
          trendLabel="vs last month"
          icon={Activity} 
          color="amber" 
        />
        <StatCard 
          title="New Signups (30d)" 
          value={summary?.new_signups_this_month.toLocaleString() || '0'}
          icon={UserPlus} 
          color="rose" 
        />
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Usage Trends</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 7
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 30
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 90
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Daily Active Users Chart */}
      <ChartCard 
        title="Daily Active Users & Signups" 
        subtitle="User engagement over time"
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="metric_date" 
                axisLine={false} 
                tickLine={false}
                tick={{fontSize: 12, fill: '#64748b'}}
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
              />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="daily_active_users" 
                stroke="#6366f1" 
                strokeWidth={2}
                name="Daily Active Users"
                dot={{ fill: '#6366f1', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="new_signups" 
                stroke="#10b981" 
                strokeWidth={2}
                name="New Signups"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Workspace Activity" 
          subtitle="Active workspaces per day"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorWorkspaces" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="metric_date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{fontSize: 12, fill: '#64748b'}}
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                />
                <Area 
                  type="monotone" 
                  dataKey="active_workspaces" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorWorkspaces)" 
                  strokeWidth={2}
                  name="Active Workspaces"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard 
          title="Platform Activity" 
          subtitle="Jobs & Applications created"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="metric_date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{fontSize: 12, fill: '#64748b'}}
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="jobs_created" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Jobs Created"
                  dot={{ fill: '#f59e0b', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications_received" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  name="Applications"
                  dot={{ fill: '#ec4899', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
              <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Today's Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active Workspaces</span>
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.active_workspaces_today || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Activities</span>
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.total_activities_today || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">New Signups</span>
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.new_signups_today || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">This Week</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active Users</span>
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.wau || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">New Signups</span>
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.new_signups_this_week || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">This Month</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active Users</span>
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.mau || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">New Signups</span>
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.new_signups_this_month || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
