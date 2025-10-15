# Frontend-Only Mode

This project has been converted to **frontend-only mode** with zero backend dependencies.

## What Changed

### Removed
- ❌ Supabase client, database, auth, edge functions
- ❌ Stripe integration
- ❌ Finnhub WebSocket connections
- ❌ All API routes and server code
- ❌ Environment variable dependencies (.env)
- ❌ Real-time data fetching
- ❌ External service webhooks

### Added
- ✅ Mock data system (`/src/mocks/`)
- ✅ Fake client (`/src/lib/fakeClient.ts`)
- ✅ Fake auth provider (`/src/providers/FakeAuthProvider.tsx`)
- ✅ Feature flags system (`/src/providers/FeaturesProvider.tsx`)
- ✅ Runtime configuration (`/src/config/runtime.ts`)

## Architecture

### Mock Data (`/src/mocks/`)
- `userProfile.ts` - User profiles (free/pro)
- `tickers.ts` - Stock ticker data
- `chartSeries.ts` - Chart data with price history
- `signals.ts` - Trading signals
- `plans.ts` - Subscription plans

### Fake Client (`/src/lib/fakeClient.ts`)
Simulates all backend operations:
- Auth (login, signup, logout)
- Database queries (select, insert, update, delete)
- Edge function calls
- Includes simulated network latency (500ms)

### Fake Auth (`/src/providers/FakeAuthProvider.tsx`)
- Stores auth state in localStorage
- Provides `useAuth()` hook (compatible with original)
- Supports multiple mock users

### Features System (`/src/providers/FeaturesProvider.tsx`)
- Controls PRO feature access
- `useFeatures()` hook provides `isPro`, `hasFeature()`
- Automatically gates PRO features

## Usage

### Enable/Disable Frontend-Only Mode
Edit `/src/config/runtime.ts`:
```typescript
export const FRONTEND_ONLY = true; // Set to false to re-enable backend
```

### Mock Users
Available users (set in localStorage):
- `founder` - PRO user (Rubén, ruben_abt@hotmail.com)
- `demo-user` - Free user (demo@example.com)

### Login
Any email/password works. Use `ruben_abt@hotmail.com` to get PRO access.

### Upgrade to PRO
Click "Activate PRO" anywhere in the app - it instantly toggles your mock user to PRO tier.

### Simulated Latency
All fake client operations have 500ms delay to simulate real network requests.

## Testing

The app now works completely offline:
```bash
npm run dev
# or
npm run build && npm run preview
```

No `.env` file needed. No external services required.

## Files Modified

### Created
- `/src/config/runtime.ts`
- `/src/mocks/*.ts` (5 files)
- `/src/lib/fakeClient.ts`
- `/src/providers/FakeAuthProvider.tsx`
- `/src/providers/FeaturesProvider.tsx`
- `/src/integrations/supabase/client-fake.ts`
- `/src/hooks/useSubscription-fake.ts`
- `/src/contexts/AuthContext-fake.tsx`
- `/src/services/auth.service-fake.ts`
- `/src/utils/stripeUtils-fake.ts`

### Modified
- `/src/providers/AppProviders.tsx` - Now uses FakeAuthProvider and FeaturesProvider
- `/src/integrations/supabase/client.ts` - Conditionally imports fake client

### Disabled (not deleted, for rollback)
- Edge functions (still exist but unused)
- Supabase config (still exists but unused)
- Original auth context (replaced with fake)

## Rollback

To restore backend functionality:
1. Set `FRONTEND_ONLY = false` in `/src/config/runtime.ts`
2. Restore `.env` file
3. Replace fake imports with original ones

## Notes

- All Supabase, Stripe, and API code is **disabled but not deleted**
- Can be re-enabled by flipping the `FRONTEND_ONLY` flag
- Mock data is fully typed and realistic
- Fake client API matches real Supabase client for easy transition
