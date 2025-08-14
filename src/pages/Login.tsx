import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartCandlestick, Eye, EyeOff, Github } from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { LanguageSelector } from '@/components/LanguageSelector';

const Login = () => {
  const { signIn, signInWithOAuth, user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslationWithFallback();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect authenticated users
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  useEffect(() => {
    const next = searchParams.get('next');
    if (next) {
      console.log('Login: next route param:', next);
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setApiError(error.message);
      } else {
        // Sign in successful
        const next = searchParams.get('next');
        if (next) {
          navigate(next);
        } else {
          navigate('/app');
        }
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setApiError(err.message || 'An unexpected error occurred');
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setApiError(null);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setApiError(error.message);
      }
      // On success, Supabase handles the redirect
    } catch (err: any) {
      console.error('OAuth sign-in error:', err);
      setApiError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="bg-gray-900 border-gray-700 shadow-lg rounded-lg">
          <CardHeader className="space-y-1 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <ChartCandlestick className="mr-2 h-6 w-6 text-tradeiq-blue" />
              {t('login.title')}
            </CardTitle>
            <LanguageSelector />
          </CardHeader>
          <CardContent className="space-y-4">
            {apiError && (
              <Alert variant="destructive">
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  {t('login.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-tradeiq-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  {t('login.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white focus-visible:ring-tradeiq-blue pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-400 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-tradeiq-blue text-white hover:bg-tradeiq-blue/90 focus:ring-tradeiq-blue disabled:bg-tradeiq-blue/50"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('login.signIn')}
              </Button>
            </form>
            <div className="text-sm text-gray-500">
              <Link to="/reset-password-request" className="hover:text-tradeiq-blue">
                {t('login.forgotPassword')}
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="text-center text-gray-500">
          {t('login.noAccount')}
          <Link to="/signup" className="ml-1 text-tradeiq-blue hover:underline">
            {t('login.signUp')}
          </Link>
        </div>
        <div className="mt-4">
          <Button
            onClick={() => handleOAuthSignIn('github')}
            className="w-full bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600 shadow-md"
          >
            <Github className="mr-2 h-4 w-4" />
            {t('login.signInGithub')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
