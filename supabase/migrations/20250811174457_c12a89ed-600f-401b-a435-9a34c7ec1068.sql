-- Fix security vulnerability: Remove email-based access to prevent unauthorized data access
-- Replace overly permissive OR-based policies with strict user_id-only policies

-- Drop the existing insecure policies
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure SELECT policy - only allow access to own user_id records
CREATE POLICY "users_can_select_own_subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure UPDATE policy - only allow updates to own user_id records  
CREATE POLICY "users_can_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Note: service_role_can_manage_subscriptions policy from previous migration 
-- remains intact for Stripe webhook functionality