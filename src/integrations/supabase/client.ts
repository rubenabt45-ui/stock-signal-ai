
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, IS_DEVELOPMENT } from '@/config/env';

// Provide fallback values for development to prevent crashes
const supabaseUrl = SUPABASE_URL || (IS_DEVELOPMENT ? 'https://placeholder.supabase.co' : '');
const supabaseKey = SUPABASE_ANON_KEY || (IS_DEVELOPMENT ? 'placeholder-key' : '');

if (!supabaseUrl || !supabaseKey) {
  if (IS_DEVELOPMENT) {
    console.warn('⚠️ [SUPABASE] Missing environment variables - using development fallbacks');
  } else {
    throw new Error('Missing required Supabase configuration. Please check your environment variables.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Log initialization status
if (IS_DEVELOPMENT) {
  console.log('🔌 [SUPABASE] Client initialized:', {
    url: supabaseUrl.includes('placeholder') ? 'PLACEHOLDER' : 'CONFIGURED',
    hasRealConfig: !supabaseUrl.includes('placeholder')
  });
}
