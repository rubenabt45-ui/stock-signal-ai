
# Stripe Setup Guide - Test to Live Migration

## Overview
This guide explains how to switch from Stripe test mode to live mode for production deployment.

## Current Configuration
- **Test Mode**: `VITE_ENABLE_STRIPE_TEST=true` (default: false)
- **Live Mode**: `VITE_ENABLE_STRIPE_TEST=false`

## Feature Flag Behavior

### When `VITE_ENABLE_STRIPE_TEST=true` (Test Mode)
- ✅ `/dev/stripe-test` route is accessible
- ✅ Test Edge Functions are enabled (`/functions/test-stripe-*`)
- ✅ All Stripe operations use test mode
- ✅ Test webhooks are processed
- ✅ Console logs show "TEST MODE" in startup checklist

### When `VITE_ENABLE_STRIPE_TEST=false` (Live Mode) 
- ❌ `/dev/stripe-test` route redirects to login/shows disabled message
- ❌ Test Edge Functions return 404
- ✅ Live Stripe operations only
- ✅ Production webhooks only
- ✅ Console logs show "LIVE MODE" in startup checklist

## Migration Steps: Test → Live

### 1. Update Stripe Keys (Supabase Secrets)
Replace test keys with live keys in your Supabase project secrets:

```bash
# In Supabase Dashboard > Settings > Edge Functions
STRIPE_SECRET_KEY=sk_live_... # (not sk_test_...)
STRIPE_PUBLISHABLE_KEY=pk_live_... # (not pk_test_...)
```

### 2. Update Webhook Configuration
- **Test webhook**: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- **Live webhook**: Same URL, but update in Stripe Dashboard under Developers > Webhooks
- Update the webhook secret:
```bash
STRIPE_WEBHOOK_SECRET=whsec_... # (new secret from live webhook)
```

### 3. Update Price ID
Set the live price ID for your Pro subscription:
```bash
STRIPE_PRICE_ID_PRO=price_live_... # (not price_test_...)
```

### 4. Disable Test Utilities
Set the environment variable to disable test mode:
```bash
VITE_ENABLE_STRIPE_TEST=false
```

### 5. Verification Checklist
After deployment, check the browser console for the startup checklist:
- [ ] "LIVE MODE" appears in logs
- [ ] "Stripe Testing: ❌ DISABLED" appears
- [ ] Production checklist items are shown
- [ ] `/dev/stripe-test` is not accessible

## Environment Variables Summary

### Required for Live Mode
```bash
# Supabase Secrets (Edge Functions)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_live_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Frontend Environment
VITE_ENABLE_STRIPE_TEST=false
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
```

### Required for Test Mode
```bash
# Supabase Secrets (Edge Functions)  
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_test_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Frontend Environment
VITE_ENABLE_STRIPE_TEST=true
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
```

## Testing the Migration

### Test Mode Verification
1. Set `VITE_ENABLE_STRIPE_TEST=true`
2. Visit `/dev/stripe-test`
3. Run automated test with test card `4242 4242 4242 4242`
4. Check console for "TEST MODE" logs

### Live Mode Verification  
1. Set `VITE_ENABLE_STRIPE_TEST=false`
2. Attempt to visit `/dev/stripe-test` (should be blocked)
3. Test actual subscription flow with real payment method
4. Check console for "LIVE MODE" logs

## Troubleshooting

### Common Issues
- **Test utilities still accessible**: Check `VITE_ENABLE_STRIPE_TEST` is exactly "false"
- **Webhook failures**: Verify `STRIPE_WEBHOOK_SECRET` matches the live webhook
- **Payment failures**: Confirm `STRIPE_SECRET_KEY` is the live key
- **Price not found**: Ensure `STRIPE_PRICE_ID_PRO` is the live price ID

### Debug Steps
1. Check browser console for startup checklist
2. Verify Supabase secrets are updated  
3. Test webhook endpoint manually
4. Check Stripe Dashboard for event logs
