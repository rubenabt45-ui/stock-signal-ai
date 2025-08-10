
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageWrapper } from '@/components/PageWrapper';

const OAuthDebug = () => {
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const [googleHealth, setGoogleHealth] = useState<any>(null);
  const [githubHealth, setGithubHealth] = useState<any>(null);
  const siteUrl = window.location.origin;
  const redirectTo = `${siteUrl}/auth/callback`;
  const supabaseUrl = "https://xnrvqfclyroagzknedhs.supabase.co";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucnZxZmNseXJvYWd6a25lZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mjg0MTgsImV4cCI6MjA2NDUwNDQxOH0.vIFgqNFnfLVoqtSs4xGWAAVmDiAeIUS3fo6C-1sbQog";

  const getUrl = async (provider: 'google' | 'github') => {
    console.log(`[OAUTH-DEBUG] Getting ${provider} URL`, { redirectTo });
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo }
    });
    
    if (error) {
      console.error('[OAUTH-DEBUG] start error', provider, error.message);
      const errorMsg = `ERROR: ${error.message}`;
      provider === 'google' ? setGoogleUrl(errorMsg) : setGithubUrl(errorMsg);
    } else {
      console.log('[OAUTH-DEBUG] start url', provider, data?.url);
      provider === 'google' ? setGoogleUrl(data?.url ?? null) : setGithubUrl(data?.url ?? null);
    }
  };

  const checkHealth = async (provider: 'google' | 'github') => {
    console.log(`[OAUTH-HEALTH] Checking ${provider} health`);
    
    try {
      const { data, error } = await supabase.functions.invoke('oauth-health', {
        method: 'GET',
        body: null,
        headers: {},
      });
      
      if (error) {
        console.error('[OAUTH-HEALTH] Function error:', error);
        const errorResult = { error: error.message, provider, timestamp: new Date().toISOString() };
        provider === 'google' ? setGoogleHealth(errorResult) : setGithubHealth(errorResult);
        return;
      }

      // Make a manual request to the health endpoint with query params
      const healthUrl = `${supabaseUrl}/functions/v1/oauth-health?provider=${provider}&redirect=${encodeURIComponent(redirectTo)}`;
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
        },
      });
      
      const result = await response.json();
      console.log('[OAUTH-HEALTH] Result:', provider, result);
      
      provider === 'google' ? setGoogleHealth(result) : setGithubHealth(result);
    } catch (error: any) {
      console.error('[OAUTH-HEALTH] Request error:', error);
      const errorResult = { error: error.message, provider, timestamp: new Date().toISOString() };
      provider === 'google' ? setGoogleHealth(errorResult) : setGithubHealth(errorResult);
    }
  };

  return (
    <PageWrapper pageName="OAuthDebug">
      <div className="min-h-screen bg-tradeiq-navy p-6">
        <pre className="bg-gray-800 text-white p-6 text-sm overflow-auto rounded-lg">
{`ENV
- Current Origin: ${siteUrl}
- redirectTo: ${redirectTo}
- Supabase URL: ${supabaseUrl}

Actions
- Click to fetch provider URL (will NOT navigate):
`}
          <div className="my-4 space-x-4">
            <button 
              onClick={() => getUrl('google')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Google Auth URL
            </button>
            <button 
              onClick={() => getUrl('github')}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Get GitHub Auth URL
            </button>
          </div>

{`- Health check (server-side fetch to Supabase authorize endpoint):
`}
          <div className="my-4 space-x-4">
            <button 
              onClick={() => checkHealth('google')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Check Google Health
            </button>
            <button 
              onClick={() => checkHealth('github')}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Check GitHub Health
            </button>
          </div>

{`Google URL:
${googleUrl ?? '(none)'}

GitHub URL:
${githubUrl ?? '(none)'}

Google Health Check:
${googleHealth ? JSON.stringify(googleHealth, null, 2) : '(no data)'}

GitHub Health Check:
${githubHealth ? JSON.stringify(githubHealth, null, 2) : '(no data)'}

Expected Redirect URI in Provider Settings:
https://xnrvqfclyroagzknedhs.supabase.co/auth/v1/callback

Interpretation Guide:
- status === 302 + location to accounts.google.com/github.com → Supabase OK, check Google consent/testers
- status === 400 + "provider not enabled" → Enable provider in Supabase
- status === 400 + "redirect_to not allowed" → Add callback URL to Supabase Additional Redirect URLs
- "redirect_uri_mismatch" → Ensure ONLY authorized redirect in Google/GitHub console`}
        </pre>
      </div>
    </PageWrapper>
  );
};

export default OAuthDebug;
