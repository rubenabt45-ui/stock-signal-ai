-- Reactivate PRO access for founder account (with protection against overrides)
UPDATE user_profiles 
SET 
  subscription_tier = 'pro',
  subscription_status = 'active',
  is_pro = true,
  subscription_expires_at = (NOW() + INTERVAL '1 year')
WHERE id = '570ebb74-74dd-424e-8191-3c7689c38ed2';