-- Fix security vulnerability: Restrict INSERT operations on subscribers table
-- Replace the overly permissive INSERT policy with a secure one

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create a new secure INSERT policy that only allows authenticated users 
-- to insert records for their own user_id and email
CREATE POLICY "authenticated_users_can_insert_own_subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  auth.email() = email
);

-- Also create a policy for service role (webhooks) to insert/update records
-- This is needed for Stripe webhooks to function properly
CREATE POLICY "service_role_can_manage_subscriptions" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);