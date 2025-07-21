
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired' | 'invalid'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationDetails, setVerificationDetails] = useState<{
    tokenHash?: string;
    type?: string;
    redirectTo?: string;
  }>({});

  useEffect(() => {
    const verifyEmailToken = async () => {
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const redirectTo = searchParams.get('redirect_to');

      console.log('🔐 [EMAIL_VERIFICATION] Token received');
      console.log('🔐 [EMAIL_VERIFICATION] Processing verification with params:', { 
        tokenHash: tokenHash ? 'present' : 'missing',
        type,
        redirectTo,
        currentUrl: window.location.href,
        currentDomain: window.location.hostname
      });

      // Store verification details for debugging
      setVerificationDetails({ tokenHash, type, redirectTo });

      // Validate required parameters
      if (!tokenHash || !type) {
        console.error('🔐 [EMAIL_VERIFICATION] Missing required parameters');
        setStatus('invalid');
        setErrorMessage('Invalid verification link. Required parameters are missing.');
        return;
      }

      if (type !== 'email') {
        console.error('🔐 [EMAIL_VERIFICATION] Invalid verification type:', type);
        setStatus('invalid');
        setErrorMessage('Invalid verification link type. Expected email verification.');
        return;
      }

      // Verify the production domain
      const isProduction = window.location.hostname === 'tradeiqpro.com';
      console.log('🔐 [EMAIL_VERIFICATION] Domain verification:', {
        currentDomain: window.location.hostname,
        isProduction,
        expectedDomain: 'tradeiqpro.com'
      });

      try {
        console.log('🔐 [EMAIL_VERIFICATION] Attempting token verification with Supabase');
        
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email'
        });

        if (error) {
          console.error('🔐 [EMAIL_VERIFICATION] Verification failed:', error);
          
          // Handle specific error types
          if (error.message.includes('expired')) {
            console.log('🔐 [EMAIL_VERIFICATION] Invalid or expired token');
            setStatus('expired');
            setErrorMessage('Your verification link has expired. Please request a new verification email.');
          } else if (error.message.includes('invalid') || error.message.includes('not found')) {
            console.log('🔐 [EMAIL_VERIFICATION] Invalid or expired token');
            setStatus('invalid');
            setErrorMessage('Your verification link is invalid or has already been used. Please request a new verification email.');
          } else {
            console.log('🔐 [EMAIL_VERIFICATION] Generic verification error');
            setStatus('error');
            setErrorMessage(error.message || 'Email verification failed. Please try again or request a new verification email.');
          }
        } else {
          console.log('🔐 [EMAIL_VERIFICATION] Verification successful');
          setStatus('success');
          
          // Show success toast with enhanced message
          toast({
            title: "🎉 Email Verified Successfully!",
            description: "Your email has been confirmed. You can now log in to your TradeIQ Pro account.",
            duration: 6000,
          });

          // Clean up URL parameters
          window.history.replaceState({}, document.title, '/verify-email');
          
          // Auto-redirect to login after 3 seconds
          setTimeout(() => {
            console.log('🔐 [EMAIL_VERIFICATION] Redirecting to login');
            navigate('/login?verified=true');
          }, 3000);
        }
      } catch (error) {
        console.error('🔐 [EMAIL_VERIFICATION] Exception during verification:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred during verification. Please try again.');
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate, toast]);

  const handleRetryVerification = () => {
    console.log('🔐 [EMAIL_VERIFICATION] User requested retry, redirecting to login');
    navigate('/login?verification_retry=true');
  };

  const handleGoToLogin = () => {
    console.log('🔐 [EMAIL_VERIFICATION] User navigating to login');
    navigate('/login');
  };

  const handleRequestNewLink = () => {
    console.log('🔐 [EMAIL_VERIFICATION] User requesting new verification link');
    navigate('/login?request_verification=true');
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="tradeiq-card w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {t('auth.verifyEmail.title')}
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
                  {t('auth.verifyEmail.verifying.title')}
                </h3>
                <p className="text-gray-400">
                  {t('auth.verifyEmail.verifying.description')}
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
                  🎉 Email Verified Successfully!
                </h3>
                <p className="text-gray-400 mb-4">
                  Your email has been confirmed. Welcome to TradeIQ Pro!
                </p>
                <p className="text-sm text-tradeiq-blue mb-4">
                  Redirecting you to login in 3 seconds...
                </p>
                <Button 
                  onClick={handleGoToLogin}
                  className="tradeiq-button-primary"
                >
                  {t('auth.verifyEmail.success.goToLogin')}
                </Button>
              </div>
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="flex justify-center">
                <div className="p-4 bg-yellow-500/20 rounded-full">
                  <AlertTriangle className="h-16 w-16 text-yellow-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  ⏰ Verification Link Expired
                </h3>
                <p className="text-gray-400 mb-4">
                  {errorMessage}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleRequestNewLink}
                    className="tradeiq-button-primary w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Request New Verification Email
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

          {(status === 'error' || status === 'invalid') && (
            <>
              <div className="flex justify-center">
                <div className="p-4 bg-red-500/20 rounded-full">
                  <XCircle className="h-16 w-16 text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {status === 'invalid' ? '❌ Invalid Verification Link' : '⚠️ Verification Failed'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {errorMessage}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleRetryVerification}
                    className="tradeiq-button-primary w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleRequestNewLink}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Request New Verification Email
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Debug Information (only in development) */}
          {window.location.hostname !== 'tradeiqpro.com' && (
            <div className="text-xs text-gray-600 border-t border-gray-700 pt-4">
              <p className="mb-2">🔧 Debug Info:</p>
              <ul className="text-left space-y-1">
                <li>Domain: {window.location.hostname}</li>
                <li>Token: {verificationDetails.tokenHash ? 'Present' : 'Missing'}</li>
                <li>Type: {verificationDetails.type || 'N/A'}</li>
                <li>Status: {status}</li>
              </ul>
            </div>
          )}

          <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
            <p>
              Need help? Contact support at support@tradeiqpro.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
