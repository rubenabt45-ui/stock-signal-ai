
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageWrapper } from '@/components/PageWrapper';

const OAuthDebug = () => {
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const siteUrl = window.location.origin;
  const redirectTo = `${siteUrl}/auth/callback`;
  const supabaseUrl = "https://xnrvqfclyroagzknedhs.supabase.co";

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

{`Google URL:
${googleUrl ?? '(none)'}

GitHub URL:
${githubUrl ?? '(none)'}

Expected Redirect URI in Provider Settings:
https://xnrvqfclyroagzknedhs.supabase.co/auth/v1/callback`}
        </pre>
      </div>
    </PageWrapper>
  );
};

export default OAuthDebug;
