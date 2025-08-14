
-- Add the last_free_analysis_at column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN last_free_analysis_at TIMESTAMP WITH TIME ZONE;

-- Add a comment to document the column
COMMENT ON COLUMN public.user_profiles.last_free_analysis_at IS 'Tracks when user last used their free daily StrategyAI analysis';
