
# OAuth Setup Guide

## Google OAuth Client (Web Application)

### Google Cloud Console Setup

1. **Authorized Redirect URIs** (CRITICAL - exact match required):
   ```
   https://<PROJECT_REF>.supabase.co/auth/v1/callback
   ```
   (Replace `<PROJECT_REF>` with your actual Supabase project reference)

2. **Authorized JavaScript Origins**:
   ```
   https://tradeiqpro.com
   http://localhost:3000
   ```

3. **OAuth Consent Screen**:
   - Set to "External" and "Published" (or "Testing" with tester emails added)
   - If using Google Workspace: Admin must allow the OAuth client ID

## GitHub OAuth App

### GitHub Developer Settings

1. **Authorization Callback URL**:
   ```
   https://<PROJECT_REF>.supabase.co/auth/v1/callback
   ```

## Supabase Dashboard Configuration

### Auth → URL Configuration

1. **Site URL**:
   ```
   https://tradeiqpro.com
   ```

2. **Additional Redirect URLs**:
   ```
   https://tradeiqpro.com/auth/callback
   http://localhost:3000/auth/callback
   ```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Testing & Troubleshooting

### 1. DNS/Host Check
Call `/api/supabase-host-check` to verify your Supabase URL resolves correctly:
```json
{ "dnsOk": true, "host": "your-project.supabase.co" }
```

### 2. OAuth Authorization Test
Call `/api/oauth/authorize-test?provider=google` to test the OAuth flow:
```json
{ "status": 302, "location": "https://accounts.google.com/oauth/authorize?..." }
```

### 3. Common Issues

- **`redirect_uri_mismatch`**: Ensure the authorized redirect URI in Google/GitHub exactly matches `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
- **`access_denied`**: Google Workspace admin may be blocking third-party apps
- **DNS issues**: Verify `NEXT_PUBLIC_SUPABASE_URL` is correct and the host resolves

### 4. Flow Verification

1. Click "Continue with Google/GitHub"
2. Redirected to provider (Google/GitHub)
3. After authorization, returned to `/auth/callback`
4. Code exchanged for session via `exchangeCodeForSession`
5. Redirected to authenticated area (`/app`)

## Important Notes

- No hardcoded `*.supabase.co` URLs in code - everything uses `NEXT_PUBLIC_SUPABASE_URL`
- Runtime-safe `redirectTo` using `window.location.origin`
- Preflight DNS check prevents OAuth attempts with invalid hosts
- Comprehensive error logging for debugging OAuth issues
