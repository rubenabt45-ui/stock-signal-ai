// Fake Supabase client for frontend-only mode
import { fakeClient } from '@/lib/fakeClient';

export const supabase = fakeClient as any;
