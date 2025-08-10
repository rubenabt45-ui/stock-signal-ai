
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔐 [OAUTH_CALLBACK] Processing OAuth callback');
      
      const error = searchParams.get('error');
      const code = searchParams.get('code');
      
      if (error) {
        console.error('🔐 [OAUTH_CALLBACK] OAuth error:', error);
        navigate(`/login?error=${encodeURIComponent(error)}`);
        return;
      }
      
      if (!code) {
        console.error('🔐 [OAUTH_CALLBACK] No authorization code received');
        navigate('/login?error=no_code');
        return;
      }
      
      try {
        console.log('🔐 [OAUTH_CALLBACK] Exchanging code for session');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('🔐 [OAUTH_CALLBACK] Code exchange error:', exchangeError);
          navigate(`/login?error=${encodeURIComponent(exchangeError.message)}`);
          return;
        }
        
        if (data.session) {
          console.log('🔐 [OAUTH_CALLBACK] Session established successfully');
          navigate('/app');
        } else {
          console.error('🔐 [OAUTH_CALLBACK] No session after code exchange');
          navigate('/login?error=callback_no_session');
        }
      } catch (error: any) {
        console.error('🔐 [OAUTH_CALLBACK] Callback processing error:', error);
        navigate(`/login?error=${encodeURIComponent(error.message || 'callback_error')}`);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return null;
};

export default AuthCallback;
