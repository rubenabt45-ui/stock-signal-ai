-- Fix Function Search Path Mutable warnings by updating all functions with secure search_path

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update update_user_favorites_updated_at function  
CREATE OR REPLACE FUNCTION public.update_user_favorites_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$function$;

-- Update reset_daily_message_count function
CREATE OR REPLACE FUNCTION public.reset_daily_message_count()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.user_profiles 
  SET daily_message_count = 0,
      daily_message_reset = CURRENT_DATE
  WHERE daily_message_reset < CURRENT_DATE;
END;
$function$;

-- Update update_user_alerts_updated_at function
CREATE OR REPLACE FUNCTION public.update_user_alerts_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;