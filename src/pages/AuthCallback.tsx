
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔐 [OAuth] Callback processing started');
      
      // Check for errors first
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description') || searchParams.get('error_subtype');
      
      if (error) {
        console.error('🔐 [OAuth] Callback error:', { error, errorDescription });
        navigate(`/login?error=${encodeURIComponent(error)}`);
        return;
      }

      // Get the code for session exchange
      const code = searchParams.get('code');
      const redirect = searchParams.get('redirect') || '/app';

      if (code) {
        console.log('🔐 [OAuth] Exchanging code for session');
        
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('🔐 [OAuth] Exchange error:', error);
            navigate('/login?error=exchange_failed');
            return;
          }
          
          console.log('🔐 [OAuth] Exchange successful:', !!data?.session);
        } catch (err) {
          console.error('🔐 [OAuth] Exchange exception:', err);
          navigate('/login?error=exchange_failed');
          return;
        }
      }

      // Verify we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('🔐 [OAuth] No session after callback');
        navigate('/login?error=callback_no_session');
        return;
      }

      console.log('🔐 [OAuth] Callback successful, redirecting to:', redirect);
      navigate(redirect);
    };

    handleCallback();
  }, [navigate, searchParams]);

  return null;
};

export default AuthCallback;
