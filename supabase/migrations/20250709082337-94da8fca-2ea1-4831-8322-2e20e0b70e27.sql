-- Add subscription fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS daily_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_message_reset DATE DEFAULT CURRENT_DATE;

-- Create subscribers table for detailed subscription tracking
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create function to reset daily message count
CREATE OR REPLACE FUNCTION public.reset_daily_message_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles 
  SET daily_message_count = 0,
      daily_message_reset = CURRENT_DATE
  WHERE daily_message_reset < CURRENT_DATE;
END;
$$;

-- Update the handle_new_user function to include subscription defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    full_name, 
    is_pro, 
    subscription_tier, 
    subscription_status,
    daily_message_count,
    daily_message_reset
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false,
    'free',
    'inactive',
    0,
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$;