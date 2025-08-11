
# TradeIQ - Go-Live Production Checklist

## Pre-Deployment Preparation

### Environment Configuration
- [ ] **Stripe Configuration**
  - [ ] Set `VITE_STRIPE_MODE=live` in production environment
  - [ ] Update `VITE_STRIPE_PUBLISHABLE_KEY` to live publishable key (`pk_live_...`)
  - [ ] Update Supabase secrets with live Stripe secret key (`sk_live_...`)
  - [ ] Update `STRIPE_PRICE_ID_PRO` to live price ID
  - [ ] Set `VITE_ENABLE_STRIPE_TEST=false` to hide test utilities

- [ ] **Supabase Configuration**
  - [ ] Production Supabase project configured
  - [ ] Environment variables set correctly
  - [ ] Database migrations applied
  - [ ] RLS policies tested and verified
  - [ ] Edge functions deployed and tested

- [ ] **Analytics & Monitoring**
  - [ ] Set `VITE_ANALYTICS_ID` to production analytics ID
  - [ ] Set `VITE_ANALYTICS_PROVIDER` (gtag or plausible)
  - [ ] Verify analytics tracking in production
  - [ ] Error logging configured appropriately

### Stripe Live Mode Setup
- [ ] **Stripe Dashboard Configuration**
  - [ ] Live mode activated in Stripe dashboard
  - [ ] Products and prices created in live mode
  - [ ] Live webhook endpoint configured: `https://your-domain.supabase.co/functions/v1/stripe-webhook`
  - [ ] Webhook secret updated in Supabase secrets
  - [ ] Payment methods enabled (cards, Apple Pay, Google Pay as needed)

- [ ] **Test Live Payments**
  - [ ] Small test payment processed successfully
  - [ ] Webhook events processed correctly
  - [ ] Customer portal accessible and functional
  - [ ] Subscription cancellation works

### Domain & Infrastructure
- [ ] **Domain Configuration**
  - [ ] Custom domain configured (if applicable)
  - [ ] SSL certificate installed and verified
  - [ ] DNS records pointing to correct servers
  - [ ] Redirects from old domains configured (if applicable)

- [ ] **Supabase URL Configuration**
  - [ ] Site URL set to production domain in Supabase Auth settings
  - [ ] Redirect URLs configured for authentication
  - [ ] CORS origins configured if needed

### Security Verification
- [ ] **Environment Secrets**
  - [ ] No test keys in production environment
  - [ ] All API keys properly secured in Supabase secrets
  - [ ] No sensitive data in client-side code
  - [ ] Development endpoints disabled

- [ ] **Authentication Security**
  - [ ] Email confirmation enabled (recommended for production)
  - [ ] Rate limiting configured
  - [ ] Password strength requirements in place

## Deployment Process

### Pre-Deployment Testing
- [ ] **Staging Environment**
  - [ ] Complete QA checklist passed in staging
  - [ ] Performance tests completed
  - [ ] Load testing performed (if expected high traffic)
  - [ ] Security scan completed

### Production Deployment
- [ ] **Build & Deploy**
  - [ ] Production build created successfully
  - [ ] Environment variables validated
  - [ ] Assets optimized and compressed
  - [ ] Deploy to production environment

- [ ] **Immediate Post-Deployment**
  - [ ] Site loads correctly
  - [ ] Authentication flow works
  - [ ] Critical user journeys tested
  - [ ] No console errors in production

## Post-Deployment Verification

### Smoke Tests (Complete within 1 hour of deployment)
- [ ] **Core Functionality**
  - [ ] Homepage loads correctly
  - [ ] User can sign up successfully
  - [ ] User can sign in successfully
  - [ ] Dashboard accessible after login
  - [ ] Payment flow works end-to-end

- [ ] **Monitoring Setup**
  - [ ] Analytics tracking confirmed active
  - [ ] Error logging capturing events
  - [ ] Performance monitoring in place
  - [ ] Uptime monitoring configured

### 24-Hour Post-Launch Checks
- [ ] **Performance Monitoring**
  - [ ] Page load times within acceptable range
  - [ ] No significant error rates
  - [ ] Database performance stable
  - [ ] CDN/asset delivery working correctly

- [ ] **User Experience**
  - [ ] No critical user-reported issues
  - [ ] Payment processing working smoothly
  - [ ] Email delivery functioning
  - [ ] Mobile experience satisfactory

## Rollback Plan

### If Critical Issues Detected
- [ ] **Immediate Actions**
  - [ ] Document the issue(s) discovered
  - [ ] Assess severity and impact
  - [ ] Decide on rollback vs. hotfix

- [ ] **Rollback Process**
  - [ ] Revert to previous stable version
  - [ ] Switch Stripe back to test mode (if payment issues)
  - [ ] Restore previous environment configuration
  - [ ] Verify rollback successful

## Communication

### Stakeholder Notification
- [ ] **Pre-Launch**
  - [ ] Notify team of go-live timeline
  - [ ] Prepare customer communication if needed
  - [ ] Set up support channels for launch day

- [ ] **Post-Launch**
  - [ ] Confirm successful deployment to team
  - [ ] Monitor support channels for issues
  - [ ] Prepare launch announcement (if applicable)

## Success Metrics

### Key Performance Indicators (First 7 Days)
- [ ] **Technical Metrics**
  - [ ] Uptime > 99.5%
  - [ ] Page load time < 3 seconds (mobile)
  - [ ] Error rate < 1%
  - [ ] Successful payment rate > 95%

- [ ] **Business Metrics**
  - [ ] User signup rate
  - [ ] Conversion to paid subscriptions
  - [ ] User engagement metrics
  - [ ] Customer support ticket volume

## Sign-off

### Pre-Deployment Approval
- [ ] Technical lead approval: ________________
- [ ] Product owner approval: ________________
- [ ] Security review completed: ________________

### Post-Deployment Confirmation
- [ ] Deployment completed successfully: ________________
- [ ] Smoke tests passed: ________________
- [ ] Monitoring active: ________________
- [ ] Go-live confirmed: ________________

**Go-Live Date:** ________________  
**Deployed by:** ________________  
**Version:** ________________
