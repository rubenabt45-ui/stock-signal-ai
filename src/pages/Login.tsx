import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ChartCandlestick, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const { signIn, user, resendConfirmation } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for verification status and errors from URL parameters
  const verificationError = searchParams.get('verification_error');
  const isVerified = searchParams.get('verified') === 'true';

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Handle verification status messages
    if (isVerified) {
      toast({
        title: "Email Verified Successfully!",
        description: "Your email has been confirmed. You can now log in.",
        duration: 5000,
      });
      // Clean up URL parameters
      window.history.replaceState({}, document.title, '/login');
    }

    if (verificationError) {
      let errorMessage = "Please try requesting a new verification link.";
      
      if (verificationError === 'invalid_token') {
        errorMessage = "Your verification link is invalid or expired. Please request a new one.";
      } else if (verificationError === 'verification_failed') {
        errorMessage = "Email verification failed. Please try again or contact support.";
      }

      toast({
        title: "Email Verification Issue",
        description: errorMessage,
        variant: "destructive",
        duration: 10000,
      });
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, '/login');
    }
  }, [isVerified, verificationError, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      toast({
        title: t('auth.login.welcomeBack'),
        description: t('auth.login.loginSuccess'),
      });
      navigate("/app");
    }

    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend verification.",
        variant: "destructive",
      });
      return;
    }

    setResendingVerification(true);
    
    try {
      const { error } = await resendConfirmation(email);
      
      if (error) {
        console.error('🔐 Resend verification error:', error);
        toast({
          title: "Resend Failed",
          description: error.message || "Failed to resend verification email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification Email Sent!",
          description: "Please check your email and click the verification link. If you don't see it, check your spam folder.",
          duration: 8000,
        });
      }
    } catch (error) {
      console.error('🔐 Resend verification exception:', error);
      toast({
        title: "Resend Failed",
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
          {/* Verification Error Alert */}
          {verificationError && (
            <Alert className="mb-4 border-red-500/50 bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                {verificationError === 'invalid_token' 
                  ? "Your verification link is invalid or expired. Please request a new one below."
                  : "Email verification failed. Please try again or request a new verification link."
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {isVerified && (
            <Alert className="mb-4 border-green-500/50 bg-green-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-green-400">
                Email verified successfully! You can now log in with your credentials.
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
                placeholder={t('auth.login.email')}
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
                  placeholder={t('auth.login.password')}
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
            <h4 className="text-sm font-medium text-gray-300 mb-2">Need to verify your email?</h4>
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