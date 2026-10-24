import { createClient } from '@supabase/supabase-js';

// Read credentials safely from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate if real credentials have been provided
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Create the client if configured, otherwise null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Health check function: verifies if the Supabase project is reachable
export const checkSupabaseConnection = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured in .env',
      code: 'NOT_CONFIGURED',
    };
  }

  try {
    // Attempt a lightweight ping to auth settings or public courses table
    const { data, error } = await supabase.from('courses').select('id').limit(1);
    if (error) {
      // If table does not exist or network failed
      return {
        connected: false,
        message: error.message || 'Supabase connected but database tables need migration',
        code: error.code || 'TABLE_MISSING',
      };
    }
    return {
      connected: true,
      message: 'Supabase PostgreSQL connected successfully!',
      code: 'CONNECTED',
    };
  } catch (err) {
    return {
      connected: false,
      message: err?.message || 'Network error: Unable to reach Supabase project host',
      code: 'NETWORK_ERROR',
    };
  }
};

export default supabase;
