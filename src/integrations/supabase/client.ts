import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/env';

// Always use real Supabase client
// For frontend-only mode, see README-FRONTEND-ONLY.md
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

