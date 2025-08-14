
-- Add missing columns to user_profiles table for theme and language preferences
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS preferred_theme text DEFAULT 'dark',
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone;
