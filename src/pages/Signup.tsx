
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChartCandlestick, Github, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import BackToHomeButton from "@/components/BackToHomeButton";
import { PageWrapper } from '@/components/PageWrapper';

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { signUp, user, signInWithOAuth, resendConfirmation } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslationWithFallback();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('🔐 [SIGNUP] Attempting signup for:', email);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      console.error('🔐 [SIGNUP] Signup failed:', error);
      let errorMessage = error.message;
      
      if (error.message.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please try logging in instead.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("Password")) {
        errorMessage = "Password must be at least 8 characters long.";
      }
      
      toast({
        title: "❌ Signup Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
      setPendingVerification(false);
    } else {
      console.log('🔐 [SIGNUP] Signup successful, verification email sent');
      setPendingVerification(true);
      
      toast({
        title: "🎉 Account Created Successfully!",
        description: "Please check your email and click the verification link to complete your registration. Don't forget to check your spam folder!",
        duration: 12000,
      });
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

    setResendingEmail(true);
    console.log('🔐 [EMAIL_VERIFICATION] User requested resend verification');
    
    const { error } = await resendConfirmation(email);
    
    if (error) {
      console.error('🔐 [EMAIL_VERIFICATION] Resend failed:', error);
      toast({
        title: "❌ Resend Failed",
        description: error.message || "Failed to resend verification email. Please try again.",
        variant: "destructive",
        duration: 8000,
      });
    } else {
      console.log('🔐 [EMAIL_VERIFICATION] Resend successful');
      toast({
        title: "✅ Verification Email Sent!",
        description: "A new verification email has been sent to your inbox. Please check your email and spam folder.",
        duration: 10000,
      });
    }
    
    setResendingEmail(false);
  };

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    console.log('🔐 [SIGNUP] Attempting OAuth signup with:', provider);

    const { error } = await signInWithOAuth(provider);

    if (error) {
      console.error('🔐 [SIGNUP] OAuth signup failed:', error);
      toast({
        title: "❌ OAuth Signup Failed",
        description: error.message || `Failed to signup with ${provider}. Please try again.`,
        variant: "destructive",
      });
    }

    setOauthLoading(null);
  };

  return (
    <PageWrapper pageName="Signup">
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="tradeiq-card w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <ChartCandlestick className="h-12 w-12 text-tradeiq-blue" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {t('auth.signup.title')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('auth.signup.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email verification pending alert */}
          {pendingVerification && (
            <Alert className="mb-6 border-blue-500/50 bg-blue-900/20">
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-blue-400">
                <div className="space-y-3">
                  <p className="font-medium">📧 Check Your Email!</p>
                  <p className="text-sm">
                    We've sent a verification link to <strong>{email}</strong>. 
                    Please check your inbox and spam folder, then click the link to verify your account.
                  </p>
                  <Button
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 bg-blue-900/30 border-blue-600 hover:bg-blue-800/30"
                  >
                    {resendingEmail ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* OAuth Signup Section */}
          <div className="space-y-4 mb-6">
            <Button
              onClick={() => handleOAuthSignup('google')}
              disabled={oauthLoading === 'google' || pendingVerification}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
            >
              {oauthLoading === 'google' ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  Creating account...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </>
              )}
            </Button>

            <Button
              onClick={() => handleOAuthSignup('github')}
              disabled={oauthLoading === 'github' || pendingVerification}
              className="w-full bg-gray-800 text-white hover:bg-gray-700 border border-gray-600"
            >
              {oauthLoading === 'github' ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Sign up with GitHub
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

          <form onSubmit={handleSignup} className="space-y-4 mt-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-300">
                {t('auth.signup.fullName')}
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('placeholders.enterFullName')}
                required
                disabled={pendingVerification}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                {t('auth.signup.email')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholders.enterEmail')}
                required
                disabled={pendingVerification}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                {t('auth.signup.password')}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('placeholders.enterPassword')}
                  required
                  minLength={8}
                  disabled={pendingVerification}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                {t('auth.signup.confirmPassword')}
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('placeholders.confirmPassword')}
                  required
                  minLength={8}
                  disabled={pendingVerification}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || pendingVerification}
              className="tradeiq-button-primary w-full"
            >
              {loading ? 'Creating Account...' : pendingVerification ? 'Account Created - Check Email' : t('auth.signup.signUp')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('auth.signup.hasAccount')}{" "}
              <Link
                to="/login"
                className="text-tradeiq-blue hover:text-blue-400 font-medium"
              >
                {t('auth.signup.signIn')}
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

export default Signup;
