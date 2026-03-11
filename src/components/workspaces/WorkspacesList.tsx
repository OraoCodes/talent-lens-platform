import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Building2, 
  Users, 
  Briefcase, 
  UserCheck, 
  Search,
  Loader2,
  Calendar,
  Activity,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Workspace {
  workspace_id: string;
  workspace_name: string;
  workspace_slug: string;
  workspace_logo_url: string | null;
  created_at: string;
  created_by: string;
  creator_name: string;
  creator_email: string;
  total_members: number;
  total_jobs: number;
  open_jobs: number;
  total_candidates: number;
  total_applications: number;
  last_activity: string | null;
}

export function WorkspacesList() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'activity'>('created');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  async function fetchWorkspaces() {
    try {
      const { data, error } = await supabase.rpc('get_all_workspaces_admin');
      
      if (error) throw error;
      
      setWorkspaces(data || []);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredWorkspaces = workspaces
    .filter(ws => 
      ws.workspace_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.creator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.creator_email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.workspace_name.localeCompare(b.workspace_name);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'activity':
          if (!a.last_activity) return 1;
          if (!b.last_activity) return -1;
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Workspaces</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and monitor all workspaces across the platform
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-indigo-600">{workspaces.length}</p>
          <p className="text-sm text-slate-500">Total Workspaces</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search workspaces, creators, or emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
        >
          <option value="created">Sort by: Created Date</option>
          <option value="name">Sort by: Name</option>
          <option value="activity">Sort by: Last Activity</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {workspaces.reduce((sum, ws) => sum + ws.total_jobs, 0)}
              </p>
              <p className="text-xs text-slate-500">Total Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {workspaces.reduce((sum, ws) => sum + ws.total_members, 0)}
              </p>
              <p className="text-xs text-slate-500">Total Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {workspaces.reduce((sum, ws) => sum + ws.total_candidates, 0)}
              </p>
              <p className="text-xs text-slate-500">Total Candidates</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {workspaces.reduce((sum, ws) => sum + ws.total_applications, 0)}
              </p>
              <p className="text-xs text-slate-500">Total Applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Workspace
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Jobs
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Candidates
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredWorkspaces.map((workspace) => (
                <tr
                  key={workspace.workspace_id}
                  onClick={() => navigate(`/workspaces/${workspace.workspace_id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {workspace.workspace_logo_url ? (
                        <img 
                          src={workspace.workspace_logo_url} 
                          alt={workspace.workspace_name}
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
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm"
                        style={{ display: workspace.workspace_logo_url ? 'none' : 'flex' }}
                      >
                        {workspace.workspace_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {workspace.workspace_name}
                        </p>
                        <p className="text-xs text-slate-500">@{workspace.workspace_slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{workspace.creator_name}</p>
                      <p className="text-xs text-slate-500">{workspace.creator_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{workspace.total_jobs}</p>
                      {workspace.open_jobs > 0 && (
                        <p className="text-xs text-emerald-600">{workspace.open_jobs} open</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{workspace.total_members}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{workspace.total_candidates}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{workspace.total_applications}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatDistanceToNow(new Date(workspace.created_at), { addSuffix: true })}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {workspace.last_activity ? (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDistanceToNow(new Date(workspace.last_activity), { addSuffix: true })}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400">No activity</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredWorkspaces.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No workspaces found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
