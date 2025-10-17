import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://xnrvqfclyroagzknedhs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucnZxZmNseXJvYWd6a25lZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mjg0MTgsImV4cCI6MjA2NDUwNDQxOH0.vIFgqNFnfLVoqtSs4xGWAAVmDiAeIUS3fo6C-1sbQog';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
