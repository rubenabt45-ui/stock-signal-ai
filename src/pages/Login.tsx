
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ChartCandlestick, RefreshCw, AlertCircle, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import BackToHomeButton from "@/components/BackToHomeButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const { signIn, user, resendConfirmation, signInWithOAuth } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for various URL parameters
  const verificationError = searchParams.get('verification_error');
  const isVerified = searchParams.get('verified') === 'true';
  const passwordUpdated = searchParams.get('password_updated') === 'true';
  const errorParam = searchParams.get('error');
  const verificationRetry = searchParams.get('verification_retry') === 'true';
  const requestVerification = searchParams.get('request_verification') === 'true';

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Handle various status messages
    if (isVerified) {
      toast({
        title: "🎉 Email Verified Successfully!",
        description: "Your email has been confirmed. Welcome to TradeIQ Pro! You can now log in with your credentials.",
        duration: 8000,
      });
    }

    if (passwordUpdated) {
      toast({
        title: "🔒 Password Updated Successfully!",
        description: "Your password has been changed. You can now log in with your new password.",
        duration: 6000,
      });
    }

    if (verificationError) {
      let errorMessage = "Please try requesting a new verification link below.";
      
      if (verificationError === 'invalid_token') {
        errorMessage = "Your verification link is invalid or expired. Please request a new one.";
      } else if (verificationError === 'verification_failed') {
        errorMessage = "Email verification failed. Please try again or contact support.";
      }

      toast({
        title: "❌ Email Verification Issue",
        description: errorMessage,
        variant: "destructive",
        duration: 10000,
      });
    }

    if (verificationRetry) {
      toast({
        title: "🔄 Verification Retry",
        description: "Please enter your email address and request a new verification link.",
        duration: 8000,
      });
    }

    if (requestVerification) {
      toast({
        title: "📧 Request New Verification",
        description: "Please enter your email address to receive a new verification link.",
        duration: 8000,
      });
    }

    if (errorParam === 'invalid_reset_link') {
      toast({
        title: "❌ Invalid Reset Link",
        description: "The password reset link is invalid or expired. Please request a new one.",
        variant: "destructive",
        duration: 10000,
      });
    }
    
    // Clean up URL parameters
    if (isVerified || verificationError || passwordUpdated || errorParam || verificationRetry || requestVerification) {
      window.history.replaceState({}, document.title, '/login');
    }
  }, [isVerified, verificationError, passwordUpdated, errorParam, verificationRetry, requestVerification, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔐 [LOGIN] Attempting login for:', email);

    const { error } = await signIn(email, password);

    if (error) {
      let errorMessage = error.message;
      let errorTitle = t('auth.login.loginFailed');
      
      if (error.message.includes("Email not confirmed")) {
        errorTitle = t('auth.login.emailNotConfirmed');
        errorMessage = t('auth.login.checkEmail');
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = t('auth.login.invalidCredentials');
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } else {
      console.log('🔐 [LOGIN] Login successful');
      toast({
        title: "🎉 Welcome Back!",
        description: "Successfully logged in to TradeIQ Pro. Redirecting to dashboard...",
        duration: 4000,
      });
      navigate("/app");
    }

    setLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    console.log('🔐 [LOGIN] Attempting OAuth login with:', provider);

    const { error } = await signInWithOAuth(provider);

    if (error) {
      console.error('🔐 [LOGIN] OAuth login failed:', error);
      toast({
        title: "❌ OAuth Login Failed",
        description: error.message || `Failed to login with ${provider}. Please try again.`,
        variant: "destructive",
      });
    }

    setOauthLoading(null);
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "📧 Email Required",
        description: "Please enter your email address to resend verification.",
        variant: "destructive",
      });
      return;
    }

    setResendingVerification(true);
    console.log('🔐 [LOGIN] Resending verification email for:', email);
    
    try {
      const { error } = await resendConfirmation(email);
      
      if (error) {
        console.error('🔐 [LOGIN] Resend verification error:', error);
        toast({
          title: "❌ Resend Failed",
          description: error.message || "Failed to resend verification email. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('🔐 [LOGIN] Verification email resent successfully');
        toast({
          title: "✅ Verification Email Sent!",
          description: "Please check your email and click the verification link. Don't forget to check your spam folder if you don't see it.",
          duration: 10000,
        });
      }
    } catch (error) {
      console.error('🔐 [LOGIN] Resend verification exception:', error);
      toast({
        title: "❌ Resend Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setResendingVerification(false);
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="tradeiq-card w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <ChartCandlestick className="h-12 w-12 text-tradeiq-blue" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {t('auth.login.title')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('auth.login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Alerts */}
          {(verificationError || errorParam) && (
            <Alert className="mb-4 border-red-500/50 bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                {verificationError === 'invalid_token' 
                  ? "Your verification link is invalid or expired. Please request a new one below."
                  : errorParam === 'invalid_reset_link'
                  ? "The password reset link is invalid or expired. Please request a new one from the forgot password page."
                  : "An error occurred. Please try again or request a new verification link."
                }
              </AlertDescription>
            </Alert>
          )}

          {(isVerified || passwordUpdated) && (
            <Alert className="mb-4 border-green-500/50 bg-green-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-green-400">
                {isVerified 
                  ? "🎉 Email verified successfully! Welcome to TradeIQ Pro! You can now log in with your credentials."
                  : "🔒 Password updated successfully! You can now log in with your new password."
                }
              </AlertDescription>
            </Alert>
          )}

          {(verificationRetry || requestVerification) && (
            <Alert className="mb-4 border-blue-500/50 bg-blue-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-400">
                {verificationRetry 
                  ? "🔄 Please enter your email and request a new verification link."
                  : "📧 Please enter your email to receive a new verification link."
                }
              </AlertDescription>
            </Alert>
          )}

          {/* OAuth Login Section */}
          <div className="space-y-4 mb-6">
            <Button
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading === 'google'}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
            >
              {oauthLoading === 'google' ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <Button
              onClick={() => handleOAuthLogin('github')}
              disabled={oauthLoading === 'github'}
              className="w-full bg-gray-800 text-white hover:bg-gray-700 border border-gray-600"
            >
              {oauthLoading === 'github' ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                {t('auth.login.email')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholders.enterEmail')}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('placeholders.enterPassword')}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="tradeiq-button-primary w-full"
            >
              {loading ? t('auth.login.signingIn') : t('auth.login.signIn')}
            </Button>
          </form>
          
          {/* Resend Verification Section */}
          <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-2">📧 Need to verify your email?</h4>
            <p className="text-xs text-gray-400 mb-3">
              If you haven't received a verification email or your link expired, request a new one.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={resendingVerification || !email}
              className="w-full bg-gray-700/30 border-gray-600 hover:bg-gray-600/30"
            >
              {resendingVerification ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-tradeiq-blue hover:text-blue-400 text-sm"
            >
              {t('auth.login.forgotPassword')}
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('auth.login.noAccount')}{" "}
              <Link
                to="/signup"
                className="text-tradeiq-blue hover:text-blue-400 font-medium"
              >
                {t('auth.login.signUp')}
              </Link>
            </p>
          </div>
          
          <div className="mt-4">
            <BackToHomeButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
