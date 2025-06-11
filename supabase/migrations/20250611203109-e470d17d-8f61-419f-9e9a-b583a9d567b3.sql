
-- Create the user_alerts table
CREATE TABLE IF NOT EXISTS public.user_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('price', 'percentage', 'pattern')) NOT NULL,
  threshold NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add policies
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts" ON public.user_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts" ON public.user_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON public.user_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" ON public.user_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Add alert-related columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS alerts_enabled BOOLEAN DEFAULT TRUE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT TRUE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email_alerts_enabled BOOLEAN DEFAULT FALSE;

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_user_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_alerts_updated_at_trigger
  BEFORE UPDATE ON public.user_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_alerts_updated_at();
