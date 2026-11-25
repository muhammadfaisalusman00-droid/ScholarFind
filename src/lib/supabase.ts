import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Temporary testing fallback. Environment variables take priority.
// Replace these two placeholder values in this file only for local testing.
const TEMP_SUPABASE_URL = 'https://dzdonegajrjoytbznfsi.supabase.co';
const TEMP_SUPABASE_ANON_KEY = 'sb_publishable_GEBZAy1wFQN-9ogtSWMpSw_KLuhOci_';

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

const supabaseUrl = envSupabaseUrl || TEMP_SUPABASE_URL;
const supabaseAnonKey = envSupabaseAnonKey || TEMP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'your-supabase-anon-key'
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
