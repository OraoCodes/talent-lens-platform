import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ChartCard } from '../ui/ChartCard';
import { 
  Users, 
  Building2, 
  Target, 
  Clock, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { WorkspaceDrilldown } from './WorkspaceDrilldown';
import { cn } from '../../lib/utils';
import { 
  useDashboardStats, 
  useGrowthData, 
  usePipelineData, 
  useTopWorkspaces,
  type WorkspacePerformance
} from '../../hooks/useDashboardData';

export function Overview() {
  const navigate = useNavigate();
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspacePerformance | null>(null);
  
  const { stats, loading: statsLoading } = useDashboardStats();
  const { data: growthData, loading: growthLoading } = useGrowthData();
  const { data: pipelineData, loading: pipelineLoading } = usePipelineData();
  const { data: workspaces, loading: workspacesLoading } = useTopWorkspaces();

  const isLoading = statsLoading || growthLoading || pipelineLoading || workspacesLoading;

  const exportData = () => {
    toast.success("Exporting dashboard data as CSV...");
  };

  if (selectedWorkspace) {
    return <WorkspaceDrilldown workspace={selectedWorkspace} onBack={() => setSelectedWorkspace(null)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workspaces"
          value={stats?.totalWorkspaces.toLocaleString() || '0'}
          trend={stats?.workspacesTrend || 0}
          icon={Building2}
          color="indigo"
          onClick={() => navigate('/workspaces')}
          clickable
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers.toLocaleString() || '0'}
          trend={stats?.usersTrend || 0}
          icon={Users}
          color="emerald"
          onClick={() => navigate('/engagement')}
          clickable
        />
        <StatCard
          title="Jobs Posted"
          value={stats?.jobsPosted.toLocaleString() || '0'}
          trend={stats?.jobsTrend || 0}
          icon={Target}
          color="amber"
        />
        <StatCard
          title="Avg. Time to Hire"
          value={`${stats?.avgTimeToHire || 0}d`}
          trend={stats?.timeToHireTrend || 0}
          trendLabel="days decreased"
          icon={Clock}
          color="rose"
        />
      </div>

      {/* Platform Growth Chart - Full Width */}
      <ChartCard 
        title="Platform Growth" 
        subtitle="Cumulative growth across all metrics"
        onExport={exportData}
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorWorkspaces" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-sm mb-2">{data.name}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-600 dark:text-slate-400">Workspaces:</span>
                            <span className="font-semibold text-indigo-600">{data.workspaces}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-600 dark:text-slate-400">Users:</span>
                            <span className="font-semibold text-emerald-600">{data.signups}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-600 dark:text-slate-400">Jobs:</span>
                            <span className="font-semibold text-amber-600">{data.jobs || 0}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-600 dark:text-slate-400">Applications:</span>
                            <span className="font-semibold text-rose-600">{data.applications || 0}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="workspaces" 
                stroke="#6366f1" 
                fillOpacity={1} 
                fill="url(#colorWorkspaces)" 
                strokeWidth={2}
                name="Workspaces"
              />
              <Area 
                type="monotone" 
                dataKey="signups" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
                strokeWidth={2}
                name="Users"
              />
              <Area 
                type="monotone" 
                dataKey="jobs" 
                stroke="#f59e0b" 
                fillOpacity={0} 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Jobs"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Total Workspaces</p>
            <p className="text-lg font-bold text-indigo-600">{growthData[growthData.length - 1]?.workspaces || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Total Users</p>
            <p className="text-lg font-bold text-emerald-600">{growthData[growthData.length - 1]?.signups || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Total Jobs</p>
            <p className="text-lg font-bold text-amber-600">{growthData[growthData.length - 1]?.jobs || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Total Applications</p>
            <p className="text-lg font-bold text-rose-600">{growthData[growthData.length - 1]?.applications || 0}</p>
          </div>
        </div>
      </ChartCard>

      {/* Top Workspaces Leaderboard - Full Width */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold">Top Performing Workspaces</h3>
          <p className="text-xs text-slate-500">Click to drill down</p>
        </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Workspace</th>
                <th className="px-6 py-3 text-left font-medium">Hires (30d)</th>
                <th className="px-6 py-3 text-left font-medium">Activity Score</th>
                <th className="px-6 py-3 text-left font-medium">AI Match Rate</th>
                <th className="px-6 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {workspaces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No workspace data available yet
                  </td>
                </tr>
              ) : (
                workspaces.map((ws, i) => (
                  <tr 
                    key={ws.id} 
                    onClick={() => setSelectedWorkspace(ws)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {ws.logo_url ? (
                          <img 
                            src={ws.logo_url} 
                            alt={ws.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold", ws.color)}
                          style={{ display: ws.logo_url ? 'none' : 'flex' }}
                        >
                          {ws.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{ws.name}</p>
                          <p className="text-xs text-slate-500">
                            {ws.openJobs} open jobs • {ws.totalApplications} applications
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">{ws.hires}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full w-24">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${ws.activity}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-8">{ws.activity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{ws.ai}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}