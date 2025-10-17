-- Add subscription columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone;

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Enable RLS on user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can update their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;

CREATE POLICY "Users can view their own favorites"
  ON public.user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
  ON public.user_favorites
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for user_favorites
DROP TRIGGER IF EXISTS update_user_favorites_updated_at ON public.user_favorites;
CREATE TRIGGER update_user_favorites_updated_at
  BEFORE UPDATE ON public.user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_alerts table
CREATE TABLE IF NOT EXISTS public.user_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  alert_type text NOT NULL,
  threshold numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_alerts
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for user_alerts
DROP POLICY IF EXISTS "Users can manage their own alerts" ON public.user_alerts;

CREATE POLICY "Users can manage their own alerts"
  ON public.user_alerts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for user_alerts
DROP TRIGGER IF EXISTS update_user_alerts_updated_at ON public.user_alerts;
CREATE TRIGGER update_user_alerts_updated_at
  BEFORE UPDATE ON public.user_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();