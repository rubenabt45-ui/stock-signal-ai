
# TradeIQ Pro

A comprehensive trading platform with AI-powered analysis and real-time market data.

## Google OAuth Configuration

### Required Settings for Google OAuth to work:

**Google Cloud Console:**
- **OAuth Consent Screen:** Set to "External" and "In production" (or "Testing" with your email added as a tester)
- **Authorized Redirect URI:** `https://xnrvqfclyroagzknedhs.supabase.co/auth/v1/callback` (ONLY this URI)
- **Scopes:** Only use non-sensitive scopes (openid, email, profile)

**Supabase Dashboard:**
- **Auth → Providers → Google:** Enable with your Client ID and Secret
- **Auth → URL Configuration:**
  - Site URL: `https://tradeiqpro.com`
  - Additional Redirect URLs: `https://tradeiqpro.com/auth/callback`, `http://localhost:3000/auth/callback`, `https://tradeiqpro.com`, `http://localhost:3000`

### Troubleshooting Google OAuth 403 Errors:

- **Consent screen = External and Published** (or Testing with your email whitelisted)
- **Authorized redirect URI = `https://xnrvqfclyroagzknedhs.supabase.co/auth/v1/callback`** (exact match required)
- **If using Google Workspace:** Organization policy may block third-party apps. Test with personal Gmail or request allow-listing from admin.

## GitHub OAuth Configuration

**GitHub Developer Settings → OAuth Apps:**
- **Authorization callback URL:** `https://xnrvqfclyroagzknedhs.supabase.co/auth/v1/callback`

**Supabase Dashboard:**
- **Auth → Providers → GitHub:** Enable with your Client ID and Secret

## OAuth Debugging

Visit `/oauth-debug` to test OAuth URL generation and verify configuration without navigation.

## Development

```bash
npm install
npm run dev
```

## Deployment

The app is configured to work with Supabase authentication and can be deployed to any static hosting service.
