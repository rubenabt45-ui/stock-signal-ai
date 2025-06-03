
-- Create users table extension
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create favorites table for user watchlists
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  asset_name TEXT,
  asset_type TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, symbol)
);

-- Create price updates table for real-time data storage
CREATE TABLE IF NOT EXISTS public.price_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  current_price DECIMAL(20,8),
  change DECIMAL(20,8),
  change_percent DECIMAL(10,4),
  high DECIMAL(20,8),
  low DECIMAL(20,8),
  open DECIMAL(20,8),
  previous_close DECIMAL(20,8),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(symbol, timestamp)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_price_updates_symbol_timestamp 
ON public.price_updates(symbol, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id 
ON public.user_favorites(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_updates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view price updates" ON public.price_updates
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Service role can manage price updates" ON public.price_updates
  FOR ALL TO service_role USING (true);
