
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xnrvqfclyroagzknedhs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucnZxZmNseXJvYWd6a25lZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mjg0MTgsImV4cCI6MjA2NDUwNDQxOH0.vIFgqNFnfLVoqtSs4xGWAAVmDiAeIUS3fo6C-1sbQog";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
