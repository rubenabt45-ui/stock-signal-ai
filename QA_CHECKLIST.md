
# TradeIQ - End-to-End QA Checklist

## Pre-Release Testing Checklist

### Authentication Flow Testing
- [ ] **Sign Up Flow**
  - [ ] New user can create account with email/password
  - [ ] Email validation works (valid format required)
  - [ ] Password strength validation (minimum 6 characters)
  - [ ] Duplicate email shows appropriate error
  - [ ] Email confirmation link works (if enabled)
  - [ ] New user profile is created automatically

- [ ] **Sign In Flow**
  - [ ] Existing user can sign in with correct credentials
  - [ ] Invalid credentials show appropriate error
  - [ ] Unconfirmed email shows appropriate error (if email confirmation enabled)
  - [ ] Session persists after browser refresh
  - [ ] Auto-redirect to dashboard after successful login

- [ ] **Password Reset Flow**
  - [ ] Reset password request sends email
  - [ ] Reset password link works
  - [ ] New password can be set successfully
  - [ ] Old password no longer works after reset

- [ ] **Session Management**
  - [ ] User stays logged in across browser sessions
  - [ ] Logout works properly and clears session
  - [ ] Protected routes redirect to login when not authenticated
  - [ ] Authenticated users redirected away from login/signup pages

### Subscription & Payment Testing

- [ ] **Stripe Checkout Flow**
  - [ ] "Upgrade to Pro" button opens Stripe Checkout
  - [ ] Test payment with card `4242 4242 4242 4242` completes successfully
  - [ ] User is redirected to success page after payment
  - [ ] Subscription status updates to "Pro" after successful payment
  - [ ] Webhook processes payment and updates database

- [ ] **Premium Feature Access**
  - [ ] Free users see upgrade prompts for Pro features
  - [ ] Pro users have unlimited access to all features
  - [ ] Feature gates work correctly (StrategyAI, Market Updates, Learn)
  - [ ] Premium features immediately accessible after upgrade

- [ ] **Subscription Management**
  - [ ] "Manage Subscription" opens Stripe Customer Portal
  - [ ] Users can update payment methods in portal
  - [ ] Users can cancel subscription in portal
  - [ ] Subscription status updates correctly after cancellation
  - [ ] Downgraded users lose access to Pro features

### Core Functionality Testing

- [ ] **Dashboard**
  - [ ] Dashboard loads without errors
  - [ ] Subscription status displays correctly
  - [ ] Feature cards show appropriate access levels
  - [ ] Navigation works between all sections

- [ ] **StrategyAI/TradingChat**
  - [ ] Chat interface loads and accepts messages
  - [ ] AI responses are generated (for Pro users)
  - [ ] Free users hit message limits and see upgrade prompts
  - [ ] Chat history persists between sessions (Pro users)

- [ ] **Market Updates**
  - [ ] Market data displays correctly
  - [ ] Real-time updates work (if implemented)
  - [ ] Free users see limited access prompts

- [ ] **Learn Section**
  - [ ] PDF documents load correctly
  - [ ] Content is accessible to appropriate user tiers
  - [ ] Navigation between learning materials works

### Error Handling & Edge Cases

- [ ] **Network Issues**
  - [ ] App handles offline/poor connection gracefully
  - [ ] Error messages are user-friendly
  - [ ] Retry mechanisms work appropriately

- [ ] **Invalid States**
  - [ ] Expired sessions are handled properly
  - [ ] Invalid URLs show 404 page
  - [ ] Malformed data doesn't break the app

- [ ] **Browser Compatibility**
  - [ ] App works in Chrome (latest 2 versions)
  - [ ] App works in Firefox (latest 2 versions)
  - [ ] App works in Safari (latest 2 versions)
  - [ ] App works in Edge (latest 2 versions)

### Mobile Responsiveness

- [ ] **Mobile Layout**
  - [ ] All pages display correctly on mobile devices
  - [ ] Navigation menu works on mobile
  - [ ] Touch interactions work properly
  - [ ] Text is readable without zooming

- [ ] **Performance on Mobile**
  - [ ] Pages load within 3 seconds on 3G connection
  - [ ] No layout shifts during page load
  - [ ] Images and assets load efficiently

### Production Environment Testing

- [ ] **Environment Configuration**
  - [ ] All required environment variables are set
  - [ ] Stripe is configured for live mode (if going live)
  - [ ] Analytics tracking works (if configured)
  - [ ] Error logging captures issues appropriately

- [ ] **SEO & Metadata**
  - [ ] Page titles are descriptive and unique
  - [ ] Meta descriptions are present and relevant
  - [ ] Open Graph tags work correctly
  - [ ] Favicon displays correctly

- [ ] **Security**
  - [ ] No sensitive data in client-side code
  - [ ] API endpoints require proper authentication
  - [ ] HTTPS is enforced in production
  - [ ] No console errors or warnings in production build

## Testing Notes

**Test Environment Setup:**
- Use Stripe test mode with test cards
- Use test Supabase project or ensure test data cleanup
- Clear browser cache between test runs

**Test Data:**
- Test card: `4242 4242 4242 4242` (Visa)
- Test card with SCA: `4000 0025 0000 3155`
- Declined card: `4000 0000 0000 0002`

**Critical Paths to Test Multiple Times:**
1. Complete signup → upgrade → use Pro features → cancel → verify downgrade
2. Existing user login → payment method update → successful payment
3. Mobile signup and upgrade flow

## Sign-off

- [ ] All tests passed
- [ ] No critical issues identified
- [ ] Performance meets requirements
- [ ] Ready for production deployment

**Tested by:** ________________  
**Date:** ________________  
**Environment:** ________________
