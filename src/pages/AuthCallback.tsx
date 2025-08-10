
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChartCandlestick } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔐 [OAUTH_CALLBACK] Processing OAuth callback');
      
      try {
        // Get the current session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('🔐 [OAUTH_CALLBACK] Session error:', sessionError);
          navigate('/login?error=callback_session_error');
          return;
        }

        if (!session) {
          console.error('🔐 [OAUTH_CALLBACK] No session found after OAuth');
          navigate('/login?error=callback_no_session');
          return;
        }

        console.log('🔐 [OAUTH_CALLBACK] OAuth session established successfully');
        console.log('🔐 [OAUTH_CALLBACK] User:', session.user.email);

        // Get redirect target from query params or default to app
        const redirectTo = searchParams.get('redirect') || '/app';
        
        // Navigate to the target page
        navigate(redirectTo);
        
      } catch (error) {
        console.error('🔐 [OAUTH_CALLBACK] Unexpected error:', error);
        navigate('/login?error=callback_error');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <ChartCandlestick className="h-12 w-12 text-tradeiq-blue animate-pulse" />
        <div className="text-white text-lg font-medium">Completing sign in...</div>
        <div className="text-gray-400 text-sm">Please wait while we finish setting up your account</div>
      </div>
    </div>
  );
};

export default AuthCallback;
