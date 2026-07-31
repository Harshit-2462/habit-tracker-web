import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://mplokisnrnthstxupyoh.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_HB8xjfMZBU6fYVZKj1Xwuw_uMX3WUGV';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase-url') &&
    supabaseUrl.length > 5
  );
};
