
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChartCandlestick, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import BackToHomeButton from "@/components/BackToHomeButton";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
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
        title: t('auth.signup.signupFailed'),
        description: t('auth.signup.passwordMismatch'),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t('auth.signup.signupFailed'),
        description: t('auth.signup.weakPassword'),
        variant: "destructive",
      });
      return;
    }

    if (!fullName.trim()) {
      toast({
        title: t('auth.signup.signupFailed'),
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName.trim());

    if (error) {
      console.error('🔐 Signup error:', error);
      let errorMessage = error.message;
      
      if (error.message.includes("already registered")) {
        errorMessage = "An account with this email already exists. Please try logging in instead.";
      } else if (error.message.includes("invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("weak password")) {
        errorMessage = "Password is too weak. Please use at least 6 characters with a mix of letters and numbers.";
      }
      
      toast({
        title: t('auth.signup.signupFailed'),
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } else {
      toast({
        title: t('auth.signup.accountCreated'),
        description: "Please check your email and click the verification link to activate your account. Make sure to check your spam folder if you don't see the email.",
        duration: 10000,
      });
      
      // Show success state but don't navigate
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
    }

    setLoading(false);
  };

  return (
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
                placeholder={t('auth.signup.fullName')}
                required
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
                placeholder={t('auth.signup.email')}
                required
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
                  placeholder={t('auth.signup.password')}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
                  placeholder={t('auth.signup.confirmPassword')}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="tradeiq-button-primary w-full"
            >
              {loading ? t('auth.signup.creatingAccount') : t('auth.signup.createAccount')}
            </Button>
          </form>

          {/* Email verification notice */}
          <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-300 mb-1">Email Verification Required</h4>
                <p className="text-xs text-blue-200">
                  After creating your account, you'll receive a verification email. Click the link in the email to activate your account. 
                  If you don't see the email, check your spam folder.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('auth.signup.haveAccount')}{" "}
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
  );
};

export default Signup;
