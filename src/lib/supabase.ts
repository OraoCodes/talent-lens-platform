import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykurfdrlthvfykpdpkvf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdXJmZHJsdGh2ZnlrcGRwa3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMjUwODEsImV4cCI6MjA4NzYwMTA4MX0.xix1aLA4LQP1VbI1DtMqx1frY7YCkEYRXSmJr6WQWcI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          description: string | null;
          status: 'draft' | 'open' | 'paused' | 'closed' | 'archived';
          created_at: string;
          updated_at: string;
          closed_at: string | null;
        };
      };
      candidates: {
        Row: {
          id: string;
          workspace_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      candidate_applications: {
        Row: {
          id: string;
          workspace_id: string;
          candidate_id: string;
          job_id: string;
          stage_id: string;
          applied_at: string;
          stage_entered_at: string;
          created_at: string;
          updated_at: string;
        };
      };
      pipeline_stages: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          position: number;
          color: string | null;
          is_terminal: boolean;
          created_at: string;
        };
      };
      activities: {
        Row: {
          id: string;
          workspace_id: string;
          actor_id: string | null;
          entity_type: string;
          entity_id: string;
          action: string;
          metadata: any;
          created_at: string;
        };
      };
      workspace_memberships: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'recruiter' | 'viewer';
          created_at: string;
        };
      };
      gmail_links: {
        Row: {
          id: string;
          workspace_id: string;
          sync_enabled: boolean;
          last_synced_at: string | null;
          last_error: string | null;
        };
      };
      email_ingestion_logs: {
        Row: {
          id: string;
          workspace_id: string;
          status: string;
          created_at: string;
        };
      };
    };
  };
};
