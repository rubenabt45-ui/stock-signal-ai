
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChartCandlestick, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
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
  const [pendingVerification, setPendingVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { signUp, user, resendConfirmation } = useAuth();
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

          <form onSubmit={handleSignup} className="space-y-4">
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
