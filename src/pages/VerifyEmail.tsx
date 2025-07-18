import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const redirectTo = searchParams.get('redirect_to');

      console.log('🔐 Email verification attempt:', { tokenHash, type, redirectTo });

      if (!tokenHash || type !== 'email') {
        setStatus('error');
        setErrorMessage('Invalid verification link. Please check your email for the correct link.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email'
        });

        if (error) {
          console.error('🔐 Email verification error:', error);
          
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            setStatus('expired');
            setErrorMessage('Your verification link has expired or is invalid. Please request a new one.');
          } else {
            setStatus('error');
            setErrorMessage(error.message || 'Email verification failed. Please try again.');
          }
        } else {
          console.log('🔐 Email verification successful:', data);
          setStatus('success');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 3000);
        }
      } catch (error) {
        console.error('🔐 Email verification exception:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred during verification.');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  const handleResendVerification = () => {
    navigate('/login');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="tradeiq-card w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === 'verifying' && (
            <>
              <div className="flex justify-center">
                <RefreshCw className="h-16 w-16 text-tradeiq-blue animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Verifying Your Email...
                </h3>
                <p className="text-gray-400">
                  Please wait while we verify your email address.
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <div className="p-4 bg-green-500/20 rounded-full">
                  <CheckCircle className="h-16 w-16 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Email Verified Successfully!
                </h3>
                <p className="text-gray-400 mb-4">
                  Your email has been verified. You will be redirected to the login page shortly.
                </p>
                <Button 
                  onClick={handleGoToLogin}
                  className="tradeiq-button-primary"
                >
                  Go to Login
                </Button>
              </div>
            </>
          )}

          {(status === 'error' || status === 'expired') && (
            <>
              <div className="flex justify-center">
                <div className="p-4 bg-red-500/20 rounded-full">
                  <XCircle className="h-16 w-16 text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {status === 'expired' ? 'Verification Link Expired' : 'Verification Failed'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {errorMessage}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleResendVerification}
                    className="tradeiq-button-primary w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Request New Verification Link
                  </Button>
                  <Button 
                    onClick={handleGoToLogin}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
            <p>
              If you continue to experience issues, please contact support or try copying and pasting the verification link directly into your browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;