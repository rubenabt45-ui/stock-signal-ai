import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChartCandlestick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import BackToHomeButton from "@/components/BackToHomeButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

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