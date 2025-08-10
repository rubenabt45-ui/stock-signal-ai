
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageWrapper } from '@/components/PageWrapper';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Log provider error signals if Google/GitHub bounced back with an error
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description') || searchParams.get('error_subtype');
      
      if (error) {
        console.error('[OAUTH] callback error', { error, errorDescription });
        console.error('🔐 [OAuth:callback:error]', error, errorDescription);
        console.error('🔐 [OAuth:callback:error] Full params:', Object.fromEntries(searchParams.entries()));
        
        // Redirect back to login with error info
        const errorParam = encodeURIComponent(error);
        const descParam = encodeURIComponent(errorDescription || '');
        navigate(`/login?oauth_error=${errorParam}&oauth_desc=${descParam}`);
        return;
      }

      // *** Key part: exchange the code for a session ***
      const code = searchParams.get('code');
      const redirect = searchParams.get('redirect') || '/app';

      if (code) {
        console.log('🔐 [OAuth:callback:exchange] Exchanging code for session');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('🔐 [OAuth:callback:exchange_error]', exchangeError);
          navigate('/login?error=exchange_failed');
          return;
        }
        
        console.log('🔐 [OAuth:callback:exchange_success] Session established via code exchange');
        navigate(redirect);
        return;
      }

      // Safety: if no code (some providers auto set session), ensure session exists
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[OAUTH] callback session_error');
        console.error('🔐 [OAuth:callback:session_error]', sessionError);
        navigate('/login?error=session_error');
        return;
      }

      if (!session) {
        console.error('[OAUTH] callback no_session');
        console.error('🔐 [OAuth:callback:no_session]');
        navigate('/login?error=callback_no_session');
        return;
      }

      console.log('🔐 [OAuth:callback:success] Session established, redirecting to app');
      navigate(redirect);
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <PageWrapper pageName="AuthCallback">
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto mb-4"></div>
          <p className="text-white">Completing authentication...</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AuthCallback;
