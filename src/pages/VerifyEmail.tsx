
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle, Clock } from 'lucide-react';
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
    token?: string;
    tokenHash?: string;
    type?: string;
    email?: string;
    redirectTo?: string;
  }>({});
  const [isResending, setIsResending] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const verifyEmailToken = async () => {
      // Extract all possible parameters from URL
      const token = searchParams.get('token');
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const email = searchParams.get('email');
      const redirectTo = searchParams.get('redirect_to');
      
      console.log('🔐 [EMAIL_VERIFICATION] Token received');
      console.log('🔐 [EMAIL_VERIFICATION] URL parameters:', {
        token: token ? 'present' : 'missing',
        tokenHash: tokenHash ? 'present' : 'missing',
        type: type || 'missing',
        email: email || 'missing',
        redirectTo: redirectTo || 'missing',
        fullUrl: window.location.href,
        searchParams: window.location.search,
        timestamp: new Date().toISOString()
      });

      // Store verification details for debugging
      setVerificationDetails({ token, tokenHash, type, email, redirectTo });

      // Check if we have the required parameters
      const hasToken = token || tokenHash;
      const hasType = type;

      if (!hasToken || !hasType) {
        console.error('🔐 [EMAIL_VERIFICATION] Missing required parameters');
        console.error('🔐 [EMAIL_VERIFICATION] Analysis:', {
          token: token ? 'present' : 'missing',
          tokenHash: tokenHash ? 'present' : 'missing',
          type: type ? 'present' : 'missing',
          email: email ? 'present' : 'missing',
          allParams: Object.fromEntries(searchParams.entries())
        });
        console.error('🔐 [EMAIL_MONITORING] Token validation failed - missing parameters');
        setStatus('invalid');
        setErrorMessage('Invalid verification link. Required parameters are missing. Please check your email and try clicking the link again.');
        return;
      }

      // Validate type parameter
      if (type !== 'email' && type !== 'signup') {
        console.error('🔐 [EMAIL_VERIFICATION] Invalid verification type:', type);
        console.error('🔐 [EMAIL_MONITORING] Token validation failed - invalid type');
        setStatus('invalid');
        setErrorMessage('Invalid verification link type. Please use the verification link from your email.');
        return;
      }

      // Log token validation attempt
      console.log('🔐 [EMAIL_MONITORING] Token validation initiated');
      console.log('🔐 [EMAIL_MONITORING] Token details:', {
        hasToken: !!token,
        hasTokenHash: !!tokenHash,
        type: type,
        email: email ? 'present' : 'missing'
      });

      try {
        console.log('🔐 [EMAIL_VERIFICATION] Attempting token verification with Supabase');
        
        let verificationResult;
        
        // Try verification with token_hash first (new format)
        if (tokenHash) {
          console.log('🔐 [EMAIL_VERIFICATION] Using token_hash verification');
          console.log('🔐 [EMAIL_MONITORING] Token hash verification attempt');
          verificationResult = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type === 'signup' ? 'signup' : 'email'
          });
        } else if (token) {
          console.log('🔐 [EMAIL_VERIFICATION] Using token verification');
          console.log('🔐 [EMAIL_MONITORING] Token verification attempt');
          // For token verification, we need the email parameter
          if (!email) {
            console.error('🔐 [EMAIL_VERIFICATION] Email parameter required for token verification');
            console.error('🔐 [EMAIL_MONITORING] Token validation failed - missing email for token verification');
            setStatus('invalid');
            setErrorMessage('Invalid verification link. Email parameter is missing. Please use the verification link from your email.');
            return;
          }
          verificationResult = await supabase.auth.verifyOtp({
            token: token,
            type: type === 'signup' ? 'signup' : 'email',
            email: email
          });
        }

        const { data, error } = verificationResult;

        if (error) {
          console.error('🔐 [EMAIL_VERIFICATION] Verification failed:', error);
          console.error('🔐 [EMAIL_VERIFICATION] Error details:', {
            message: error.message,
            status: error.status,
            name: error.name,
            code: error.code
          });
          console.error('🔐 [EMAIL_MONITORING] Token validation failed:', error.message);
          
          // Handle specific error types
          if (error.message.includes('expired') || error.message.includes('Token has expired')) {
            console.log('🔐 [EMAIL_VERIFICATION_ERROR] Token expired');
            console.log('🔐 [EMAIL_MONITORING] Token expired - cleanup recommended');
            setStatus('expired');
            setErrorMessage('Your verification link has expired. Please request a new verification email.');
          } else if (error.message.includes('invalid') || error.message.includes('not found') || error.message.includes('Token not found')) {
            console.log('🔐 [EMAIL_VERIFICATION_ERROR] Invalid or used token');
            console.log('🔐 [EMAIL_MONITORING] Token invalid or already used - cleanup recommended');
            setStatus('invalid');
            setErrorMessage('Your verification link is invalid or has already been used. Please request a new verification email.');
          } else {
            console.log('🔐 [EMAIL_VERIFICATION_ERROR] Generic verification error');
            console.error('🔐 [EMAIL_MONITORING] Generic verification error:', error.message);
            setStatus('error');
            setErrorMessage(error.message || 'Email verification failed. Please try again or request a new verification email.');
          }
        } else {
          console.log('🔐 [EMAIL_VERIFICATION] Verification successful');
          console.log('🔐 [EMAIL_VERIFICATION_SUCCESS] User data:', {
            userId: data.user?.id,
            email: data.user?.email,
            emailConfirmed: data.user?.email_confirmed_at ? 'confirmed' : 'pending'
          });
          console.log('🔐 [EMAIL_MONITORING] Email verification completed successfully');
          
          setStatus('success');
          
          // Show success toast
          toast({
            title: "🎉 Email Verified Successfully!",
            description: "Your email has been confirmed. You can now log in to your TradeIQ Pro account.",
            duration: 6000,
          });

          // Clean up URL parameters
          window.history.replaceState({}, document.title, '/verify-email');
          
          // Auto-redirect to login after 3 seconds
          setTimeout(() => {
            console.log('🔐 [EMAIL_VERIFICATION_SUCCESS] Redirecting to login');
            navigate('/login?verified=true');
          }, 3000);
        }
      } catch (error) {
        console.error('🔐 [EMAIL_VERIFICATION] Exception during verification:', error);
        console.error('🔐 [EMAIL_MONITORING] Verification exception:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred during verification. Please try again.');
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate, toast]);

  const handleResendVerification = async () => {
    // Get email from URL params or prompt user
    const email = searchParams.get('email') || prompt('Please enter your email address to resend verification:');
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide your email address to resend the verification email.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    setRetryCount(prev => prev + 1);
    
    try {
      console.log('🔐 [EMAIL_VERIFICATION] Resending verification email for:', email);
      console.log('🔐 [EMAIL_MONITORING] Manual resend attempt #' + (retryCount + 1));
      
      // Implement retry logic with exponential backoff
      const maxRetries = 3;
      let attempts = 0;
      let lastError;
      
      while (attempts < maxRetries) {
        try {
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
              emailRedirectTo: 'https://tradeiqpro.com/verify-email'
            }
          });

          if (error) {
            lastError = error;
            attempts++;
            
            if (attempts < maxRetries) {
              const delay = Math.pow(2, attempts) * 1000;
              console.log('🔐 [EMAIL_MONITORING] Retry attempt ' + attempts + ' failed, retrying in ' + delay + 'ms');
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
            
            console.error('🔐 [EMAIL_VERIFICATION] Resend failed after ' + maxRetries + ' attempts:', error);
            console.error('🔐 [EMAIL_MONITORING] Email resend failed after all retries:', error);
            throw error;
          }
          
          console.log('🔐 [EMAIL_VERIFICATION] Verification email resent successfully');
          console.log('🔐 [EMAIL_MONITORING] Email resend successful on attempt ' + (attempts + 1));
          
          toast({
            title: "✅ Verification Email Sent",
            description: "Please check your email for the new verification link. Don't forget to check your spam folder.",
            duration: 8000,
          });
          
          break;
        } catch (attemptError) {
          lastError = attemptError;
          attempts++;
          
          if (attempts < maxRetries) {
            const delay = Math.pow(2, attempts) * 1000;
            console.log('🔐 [EMAIL_MONITORING] Exception on attempt ' + attempts + ', retrying in ' + delay + 'ms');
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          throw attemptError;
        }
      }
      
      if (attempts >= maxRetries && lastError) {
        throw lastError;
      }
      
    } catch (error) {
      console.error('🔐 [EMAIL_VERIFICATION] Resend failed:', error);
      console.error('🔐 [EMAIL_MONITORING] Final resend failure:', error);
      toast({
        title: "Failed to Resend Email",
        description: "Please try again later or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleRetryVerification = () => {
    console.log('🔐 [EMAIL_VERIFICATION] User requested retry, redirecting to login');
    navigate('/login?verification_retry=true');
  };

  const handleGoToLogin = () => {
    console.log('🔐 [EMAIL_VERIFICATION] User navigating to login');
    navigate('/login');
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
                <div className="p-4 bg-blue-500/20 rounded-full">
                  <RefreshCw className="h-16 w-16 text-tradeiq-blue animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  🔍 Verifying Your Email...
                </h3>
                <p className="text-gray-400">
                  Please wait while we confirm your email address.
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
                <div className="flex items-center justify-center space-x-2 text-sm text-tradeiq-blue mb-4">
                  <Clock className="h-4 w-4" />
                  <span>Redirecting you to login in 3 seconds...</span>
                </div>
                <Button 
                  onClick={handleGoToLogin}
                  className="tradeiq-button-primary"
                >
                  Continue to Login
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
                <p className="text-sm text-gray-500 mb-4">
                  Verification links expire after 24 hours for security reasons.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleResendVerification}
                    className="tradeiq-button-primary w-full"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending... {retryCount > 0 && `(Attempt ${retryCount})`}
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
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
                    onClick={handleResendVerification}
                    className="tradeiq-button-primary w-full"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending... {retryCount > 0 && `(Attempt ${retryCount})`}
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleRetryVerification}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Enhanced Debug Information */}
          {window.location.hostname !== 'tradeiqpro.com' && (
            <div className="text-xs text-gray-600 border-t border-gray-700 pt-4">
              <p className="mb-2">🔧 Debug Info:</p>
              <ul className="text-left space-y-1">
                <li>Domain: {window.location.hostname}</li>
                <li>Token: {verificationDetails.token ? 'Present' : 'Missing'}</li>
                <li>Token Hash: {verificationDetails.tokenHash ? 'Present' : 'Missing'}</li>
                <li>Type: {verificationDetails.type || 'N/A'}</li>
                <li>Email: {verificationDetails.email || 'N/A'}</li>
                <li>Status: {status}</li>
                <li>Retry Count: {retryCount}</li>
                <li>Full URL: {window.location.href}</li>
                <li>Search: {window.location.search}</li>
                <li>Time: {new Date().toLocaleTimeString()}</li>
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
