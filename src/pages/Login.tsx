
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ChartCandlestick, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import BackToHomeButton from "@/components/BackToHomeButton";
import { PageWrapper } from '@/components/PageWrapper';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const { signIn, user, resendConfirmation } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslationWithFallback();
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
    <PageWrapper pageName="Login">
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

          <form onSubmit={handleLogin} className="space-y-4">
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
              to="/reset-password-request"
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
    </PageWrapper>
  );
};

export default Login;
