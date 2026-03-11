import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft,
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Activity,
  Calendar,
  Mail,
  Shield,
  Clock,
  Loader2,
  ExternalLink,
  TrendingUp,
  FileText,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface WorkspaceData {
  workspace: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
    creator_name: string;
    creator_email: string;
  };
  members: Array<{
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    role: 'owner' | 'admin' | 'recruiter' | 'viewer';
    joined_at: string;
  }>;
  jobs: Array<{
    id: string;
    title: string;
    status: string;
    location: string | null;
    employment_type: string | null;
    created_at: string;
    created_by_name: string;
    application_count: number;
  }>;
  stats: {
    total_jobs: number;
    open_jobs: number;
    total_candidates: number;
    total_applications: number;
    hired_count: number;
    recent_activity_count: number;
  };
  recent_activities: Array<{
    action: string;
    entity_type: string;
    created_at: string;
    actor_name: string | null;
  }>;
}

const roleColors = {
  owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  recruiter: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  viewer: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

const statusColors = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  closed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  archived: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

export function WorkspaceDetails() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'jobs' | 'activity'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceDetails();
    }
  }, [workspaceId]);

  async function fetchWorkspaceDetails() {
    if (!workspaceId) return;
    
    try {
      const { data: result, error } = await supabase.rpc('get_workspace_details_admin', {
        workspace_uuid: workspaceId
      });
      
      if (error) throw error;
      
      setData(result);
    } catch (error) {
      console.error('Error fetching workspace details:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteWorkspace() {
    if (!workspaceId || !data?.workspace) return;
    
    // Verify confirmation text matches workspace name
    if (deleteConfirmText !== data.workspace.name) {
      toast.error('Workspace name does not match. Please type the exact name to confirm.');
      return;
    }

    setIsDeleting(true);
    
    try {
      const { data: result, error } = await supabase.rpc('delete_workspace_admin', {
        workspace_uuid: workspaceId
      });
      
      if (error) throw error;
      
      toast.success(`Workspace "${data.workspace.name}" has been deleted successfully`);
      
      // Navigate back to workspaces list after a short delay
      setTimeout(() => {
        navigate('/workspaces');
      }, 1500);
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Failed to delete workspace. Please try again.');
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!data || !data.workspace) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Workspace not found</p>
        <button
          onClick={() => navigate('/workspaces')}
          className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { workspace, members, jobs, stats, recent_activities } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/workspaces')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {workspace.logo_url ? (
              <img 
                src={workspace.logo_url} 
                alt={workspace.name}
                className="w-16 h-16 rounded-xl object-cover"
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
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl"
              style={{ display: workspace.logo_url ? 'none' : 'flex' }}
            >
              {workspace.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{workspace.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-600 dark:text-slate-400">@{workspace.slug}</p>
                <a
                  href={`https://app.example.com/${workspace.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Public Page
                </a>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Workspace
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <span className="text-xs text-slate-500">{stats.open_jobs} open</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_jobs}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Jobs</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-emerald-600" />
            <span className="text-xs text-slate-500">{members?.length || 0} members</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_candidates}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Candidates</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-amber-600" />
            <span className="text-xs text-slate-500">{stats.hired_count} hired</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_applications}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Applications</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-rose-600" />
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.recent_activity_count}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Activities</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'activity', label: 'Activity', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workspace Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Workspace Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Created by</p>
                  <p className="font-medium text-slate-900 dark:text-white">{workspace.creator_name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{workspace.creator_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Created on</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {format(new Date(workspace.created_at), 'PPP')}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(workspace.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Last updated</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {format(new Date(workspace.updated_at), 'PPP')}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Conversion Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {stats.total_applications > 0 
                      ? `${((stats.hired_count / stats.total_applications) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Avg. Applications per Job</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {stats.total_jobs > 0 
                      ? Math.round(stats.total_applications / stats.total_jobs)
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Active Job Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {stats.total_jobs > 0 
                      ? `${((stats.open_jobs / stats.total_jobs) * 100).toFixed(0)}%`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Candidates per Member</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {members?.length > 0 
                      ? Math.round(stats.total_candidates / members.length)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg">Team Members ({members?.length || 0})</h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {members?.map((member) => (
                <div key={member.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.full_name}
                          className="w-12 h-12 rounded-full object-cover"
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
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold"
                        style={{ display: member.avatar_url ? 'none' : 'flex' }}
                      >
                        {member.full_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{member.full_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-600 dark:text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                        <Shield className="w-3 h-3" />
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Joined {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {(!members || members.length === 0) && (
                <div className="p-12 text-center text-slate-500">
                  No members found
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg">Jobs ({jobs?.length || 0})</h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {jobs?.map((job) => (
                <div key={job.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{job.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status as keyof typeof statusColors] || statusColors.draft}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        {job.location && (
                          <span>{job.location}</span>
                        )}
                        {job.employment_type && (
                          <span>{job.employment_type}</span>
                        )}
                        <span>{job.application_count} applications</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Created by {job.created_by_name} • {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {(!jobs || jobs.length === 0) && (
                <div className="p-12 text-center text-slate-500">
                  No jobs found
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {recent_activities?.map((activity, index) => (
                <div key={index} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Activity className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">{activity.actor_name || 'System'}</span>
                        {' '}{activity.action}{' '}
                        <span className="text-slate-600 dark:text-slate-400">{activity.entity_type}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {(!recent_activities || recent_activities.length === 0) && (
                <div className="p-12 text-center text-slate-500">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Workspace</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                  This will permanently delete:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 ml-4 list-disc">
                  <li>Workspace: <strong>{workspace.name}</strong></li>
                  <li>All jobs ({stats.total_jobs})</li>
                  <li>All candidates ({stats.total_candidates})</li>
                  <li>All applications ({stats.total_applications})</li>
                  <li>All team members and invitations</li>
                  <li>All activity history</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type <span className="font-bold text-slate-900 dark:text-white">{workspace.name}</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Enter workspace name"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isDeleting}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  disabled={isDeleting || deleteConfirmText !== workspace.name}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Workspace
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
