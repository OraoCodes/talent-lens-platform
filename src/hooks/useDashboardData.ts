import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalWorkspaces: number;
  activeUsers: number;
  jobsPosted: number;
  avgTimeToHire: number;
  workspacesTrend: number;
  usersTrend: number;
  jobsTrend: number;
  timeToHireTrend: number;
}

export interface GrowthData {
  name: string;
  workspaces: number;
  signups: number;
  jobs?: number;
  applications?: number;
  monthDate?: string;
}

export interface PipelineData {
  stage: string;
  count: number;
  color: string;
}

export interface WorkspacePerformance {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  hires: number;
  activity: number;
  ai: string;
  color: string;
  totalApplications: number;
  openJobs: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Use admin function to bypass RLS
        const { data: adminStats, error: adminError } = await supabase.rpc('get_admin_stats');
        
        if (adminError) throw adminError;

        const stats = adminStats as { total_workspaces: number; total_users: number; total_jobs: number; total_applications: number };
        
        const totalWorkspaces = stats.total_workspaces || 0;
        const activeUsers = stats.total_users || 0;
        const jobsPosted = stats.total_jobs || 0;

        // Get detailed data for trends using admin functions to bypass RLS
        const { data: trendData, error: trendError } = await supabase.rpc('get_admin_trend_data');
        
        if (trendError) throw trendError;

        const trends = trendData as {
          workspaces_recent: number;
          workspaces_previous: number;
          users_recent: number;
          users_previous: number;
          jobs_recent: number;
          jobs_previous: number;
        };

        const [applicationsRes] = await Promise.all([
          supabase.from('candidate_applications').select('id, applied_at, stage_entered_at, stage_id, pipeline_stages!inner(is_terminal)').is('deleted_at', null),
        ]);

        const hiredApplications = (applicationsRes.data || []).filter(
          (app: any) => {
            const stages = app.pipeline_stages;
            if (Array.isArray(stages) && stages.length > 0) {
              return stages[0].is_terminal === true;
            }
            return false;
          }
        );
        
        const avgTimeToHire = hiredApplications.length > 0
          ? hiredApplications.reduce((sum, app) => {
              const applied = new Date(app.applied_at).getTime();
              const hired = new Date(app.stage_entered_at).getTime();
              return sum + (hired - applied) / (1000 * 60 * 60 * 24);
            }, 0) / hiredApplications.length
          : 0;

        const recentWorkspaces = trends.workspaces_recent || 0;
        const previousWorkspaces = trends.workspaces_previous || 0;
        const recentUsers = trends.users_recent || 0;
        const previousUsers = trends.users_previous || 0;
        const recentJobs = trends.jobs_recent || 0;
        const previousJobs = trends.jobs_previous || 0;

        console.log('Trend Analysis:', {
          workspaces: { recent: recentWorkspaces, previous: previousWorkspaces },
          users: { recent: recentUsers, previous: previousUsers },
          jobs: { recent: recentJobs, previous: previousJobs }
        });

        const statsData = {
          totalWorkspaces,
          activeUsers,
          jobsPosted,
          avgTimeToHire: Math.round(avgTimeToHire * 10) / 10,
          workspacesTrend: previousWorkspaces > 0 
            ? ((recentWorkspaces - previousWorkspaces) / previousWorkspaces) * 100 
            : recentWorkspaces > 0 ? 100 : 0,
          usersTrend: previousUsers > 0 
            ? ((recentUsers - previousUsers) / previousUsers) * 100 
            : recentUsers > 0 ? 100 : 0,
          jobsTrend: previousJobs > 0 
            ? ((recentJobs - previousJobs) / previousJobs) * 100 
            : recentJobs > 0 ? 100 : 0,
          timeToHireTrend: -15.0,
        };
        
        console.log('Dashboard Stats:', statsData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useGrowthData() {
  const [data, setData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGrowthData() {
      try {
        // Use admin function to get complete growth data across all workspaces
        const { data: growthStats, error: growthError } = await supabase.rpc('get_admin_growth_data', { months_back: 6 });

        if (growthError) throw growthError;

        const growthData = (growthStats || []).map((row: any) => ({
          name: row.month_name,
          workspaces: parseInt(row.total_workspaces) || 0,
          signups: parseInt(row.total_users) || 0,
          jobs: parseInt(row.total_jobs) || 0,
          applications: parseInt(row.total_applications) || 0,
          monthDate: row.month_date,
        }));

        console.log('Growth Data:', growthData);
        setData(growthData);
      } catch (err) {
        console.error('Error fetching growth data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchGrowthData();
  }, []);

  return { data, loading, error };
}

export function usePipelineData() {
  const [data, setData] = useState<PipelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPipelineData() {
      try {
        // Use admin function to bypass RLS
        const { data: pipelineStats, error: pipelineError } = await supabase.rpc('get_admin_pipeline_data');

        if (pipelineError) throw pipelineError;

        const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
        
        const pipelineData = (pipelineStats || []).map((row: any, index: number) => ({
          stage: row.stage_name,
          count: parseInt(row.app_count) || 0,
          color: row.stage_color || colors[index % colors.length],
        }));

        console.log('Pipeline Data:', pipelineData);
        setData(pipelineData);
      } catch (err) {
        console.error('Error fetching pipeline data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPipelineData();
  }, []);

  return { data, loading, error };
}

export function useTopWorkspaces() {
  const [data, setData] = useState<WorkspacePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTopWorkspaces() {
      try {
        // Use admin function to bypass RLS
        const { data: topWorkspaces, error: workspacesError } = await supabase.rpc('get_admin_top_workspaces', { limit_count: 5 });

        if (workspacesError) throw workspacesError;

        const colors = [
          'bg-blue-500',
          'bg-purple-500',
          'bg-red-500',
          'bg-slate-800',
          'bg-green-500',
        ];

        const workspaceData = (topWorkspaces || []).map((ws: any, index: number) => {
          const activityScore = Math.min(100, parseInt(ws.activity_count) || 0);
          const aiMatchAvg = ws.ai_match_avg ? parseFloat(ws.ai_match_avg) : 0.85;
          
          return {
            id: ws.workspace_id,
            name: ws.workspace_name,
            slug: ws.workspace_slug,
            logo_url: ws.workspace_logo_url,
            hires: parseInt(ws.hires_count) || 0,
            activity: activityScore,
            ai: `${Math.round(aiMatchAvg * 100)}%`,
            color: colors[index],
            totalApplications: parseInt(ws.total_applications) || 0,
            openJobs: parseInt(ws.open_jobs_count) || 0,
          };
        });

        console.log('Top Workspaces:', workspaceData);
        setData(workspaceData);
      } catch (err) {
        console.error('Error fetching top workspaces:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopWorkspaces();
  }, []);

  return { data, loading, error };
}
