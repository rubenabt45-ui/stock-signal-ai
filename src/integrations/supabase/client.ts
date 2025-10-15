// Frontend-only mode: Use fake client
import { FRONTEND_ONLY } from '@/config/runtime';
import { fakeClient } from '@/lib/fakeClient';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/env';

// @ts-ignore - Dynamic export based on mode
export const supabase = FRONTEND_ONLY 
  ? fakeClient 
  : createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

