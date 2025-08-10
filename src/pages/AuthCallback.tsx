
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageWrapper } from '@/components/PageWrapper';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Check for OAuth errors from Google/GitHub
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description') || searchParams.get('error_subtype');
      
      if (error) {
        console.error('🔐 [OAuth:callback:error]', error, errorDescription);
        console.error('🔐 [OAuth:callback:error] Full params:', Object.fromEntries(searchParams.entries()));
        
        // Redirect back to login with error info
        const errorParam = encodeURIComponent(error);
        const descParam = encodeURIComponent(errorDescription || '');
        navigate(`/login?oauth_error=${errorParam}&oauth_desc=${descParam}`);
        return;
      }

      // Get session after OAuth callback
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('🔐 [OAuth:callback:session_error]', sessionError);
        navigate('/login?error=session_error');
        return;
      }

      if (!session) {
        console.error('🔐 [OAuth:callback:no_session]');
        navigate('/login?error=callback_no_session');
        return;
      }

      console.log('🔐 [OAuth:callback:success] Session established, redirecting to app');
      navigate('/app');
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
