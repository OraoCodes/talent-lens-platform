import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Clock, 
  Search,
  Filter,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar
} from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '../../lib/utils';

interface UserEngagement {
  user_id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  total_workspaces: number;
  workspace_roles: Array<{
    workspace_id: string;
    workspace_name: string;
    workspace_slug: string;
    role: string;
    joined_at: string;
  }> | null;
  total_activities: number;
  last_activity_at: string | null;
  activity_breakdown: Record<string, number> | null;
  days_since_signup: number;
  days_since_last_login: number | null;
  is_active: boolean;
}

export function EngagementSection() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'last_login' | 'signup' | 'activity'>('last_login');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsersEngagement();
  }, []);

  async function fetchUsersEngagement() {
    try {
      const { data, error } = await supabase.rpc('get_admin_users_engagement');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching user engagement:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'all' ? true :
        filterStatus === 'active' ? user.is_active :
        !user.is_active;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let compareA: any, compareB: any;
      
      switch (sortBy) {
        case 'last_login':
          compareA = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
          compareB = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
          break;
        case 'signup':
          compareA = new Date(a.created_at).getTime();
          compareB = new Date(b.created_at).getTime();
          break;
        case 'activity':
          compareA = a.total_activities;
          compareB = b.total_activities;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'desc' ? compareB - compareA : compareA - compareB;
    });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    avgActivities: users.length > 0 
      ? Math.round(users.reduce((sum, u) => sum + u.total_activities, 0) / users.length)
      : 0,
  };

  const exportData = () => {
    const csv = [
      ['Email', 'Name', 'Last Login', 'Workspaces', 'Activities', 'Status'].join(','),
      ...filteredUsers.map(u => [
        u.email,
        u.full_name,
        u.last_sign_in_at ? format(new Date(u.last_sign_in_at), 'yyyy-MM-dd HH:mm') : 'Never',
        u.total_workspaces,
        u.total_activities,
        u.is_active ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-engagement-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
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
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users} 
          color="indigo" 
        />
        <StatCard 
          title="Active Users (7d)" 
          value={stats.activeUsers.toLocaleString()} 
          trend={stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}
          trendLabel="of total"
          icon={Activity} 
          color="emerald" 
        />
        <StatCard 
          title="Avg. Activities" 
          value={stats.avgActivities.toLocaleString()} 
          icon={Clock} 
          color="amber" 
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Active Users</h3>
              <p className="text-sm text-slate-500 mt-1">
                Complete user activity and engagement tracking
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active (7d)</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="last_login">Last Login</option>
                <option value="signup">Signup Date</option>
                <option value="activity">Activity Count</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">User</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Last Login</th>
                <th className="px-6 py-3 text-left font-medium">Workspaces</th>
                <th className="px-6 py-3 text-left font-medium">Activities</th>
                <th className="px-6 py-3 text-left font-medium">Signup Date</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <React.Fragment key={user.user_id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name}
                              className="w-10 h-10 rounded-full object-cover"
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
                            className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold"
                            style={{ display: user.avatar_url ? 'none' : 'flex' }}
                          >
                            {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{user.full_name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          user.is_active 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        )}>
                          {user.is_active ? (
                            <><CheckCircle2 className="w-3 h-3" /> Active</>
                          ) : (
                            <><XCircle className="w-3 h-3" /> Inactive</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.last_sign_in_at ? (
                          <div>
                            <p className="text-slate-900 dark:text-white">
                              {formatDistanceToNow(new Date(user.last_sign_in_at), { addSuffix: true })}
                            </p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(user.last_sign_in_at), 'MMM d, yyyy HH:mm')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{user.total_workspaces}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{user.total_activities.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-900 dark:text-white">
                            {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setExpandedUser(expandedUser === user.user_id ? null : user.user_id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Details
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Details */}
                    {expandedUser === user.user_id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Workspaces */}
                            <div>
                              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Workspace Memberships ({user.total_workspaces})
                              </h4>
                              {user.workspace_roles && user.workspace_roles.length > 0 ? (
                                <div className="space-y-2">
                                  {user.workspace_roles.map((ws) => (
                                    <div 
                                      key={ws.workspace_id}
                                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                                    >
                                      <div>
                                        <p className="font-medium text-sm">{ws.workspace_name}</p>
                                        <p className="text-xs text-slate-500">
                                          Joined {formatDistanceToNow(new Date(ws.joined_at), { addSuffix: true })}
                                        </p>
                                      </div>
                                      <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 text-xs font-medium rounded">
                                        {ws.role}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500">No workspace memberships</p>
                              )}
                            </div>

                            {/* Activity Breakdown */}
                            <div>
                              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Activity Breakdown ({user.total_activities} total)
                              </h4>
                              {user.activity_breakdown && Object.keys(user.activity_breakdown).length > 0 ? (
                                <div className="space-y-2">
                                  {Object.entries(user.activity_breakdown)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([action, count]) => (
                                      <div 
                                        key={action}
                                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                                      >
                                        <span className="text-sm capitalize">{action.replace(/_/g, ' ')}</span>
                                        <span className="font-semibold text-sm">{count}</span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500">No activities recorded</p>
                              )}
                              
                              {user.last_activity_at && (
                                <p className="text-xs text-slate-500 mt-3">
                                  Last activity: {formatDistanceToNow(new Date(user.last_activity_at), { addSuffix: true })}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
}
