import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartCandlestick, Eye, EyeOff, Github } from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { LanguageSelector } from '@/components/LanguageSelector';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithOAuth } = useAuth();
  const { t } = useTranslationWithFallback();

  useEffect(() => {
    // Redirect if already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/app');
    }
  }, [navigate]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const strength = calculatePasswordStrength(value);
    setPasswordStrength(strength);
  };

  const calculatePasswordStrength = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (password.length >= minLength) strength += 1;
    if (hasUpperCase) strength += 1;
    if (hasLowerCase) strength += 1;
    if (hasNumbers) strength += 1;
    if (hasSymbols) strength += 1;

    return strength;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName) {
      setError(t('signup.fullNameRequired'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('signup.passwordsNotMatch'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await signUp(email, password, fullName);

      if (response?.error) {
        setError(response.error.message || t('signup.defaultError'));
      } else {
        setSuccess(true);
        // Optionally redirect or show a success message
        // navigate('/verify-email');
      }
    } catch (err: any) {
      setError(err.message || t('signup.defaultError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    try {
      const response = await signInWithOAuth(provider);

      if (response?.error) {
        setError(response.error.message || t('signup.defaultError'));
      } else {
        // OAuth signup successful, the user is redirected automatically
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || t('signup.defaultError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="tradeiq-card w-full max-w-md">
        <CardHeader className="space-y-1">
          <ChartCandlestick className="h-6 w-6 text-tradeiq-blue mx-auto" />
          <CardTitle className="text-2xl text-center">{t('signup.createAccount')}</CardTitle>
          <CardDescription className="text-center text-gray-400">{t('signup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LanguageSelector />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{t('signup.successMessage')}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">{t('signup.fullName')}</Label>
              <Input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('signup.fullNamePlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{t('signup.email')}</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('signup.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">{t('signup.password')}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder={t('signup.passwordPlaceholder')}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <PasswordStrengthIndicator strength={passwordStrength} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('signup.confirmPasswordPlaceholder')}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button disabled={loading} type="submit" className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90">
              {loading ? t('common.loading') : t('signup.signUp')}
            </Button>
          </form>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-tradeiq-navy px-2 text-gray-500">{t('signup.or')}</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full hover:bg-gray-800/50 border-gray-700/50 text-gray-300"
            onClick={() => handleOAuthSignup('google')}
            disabled={loading}
          >
            {loading ? (
              t('common.loading')
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M23.5 12.5h-.03v-.91h-.01c-.1-.64-.16-1.3-.16-1.97 0-.67.06-1.33.16-1.97h.01v-.91h.03c0-.47-.36-.83-.83-.83H.83c-.47 0-.83.36-.83.83v.91h.01c.1.64.16 1.3.16 1.97 0 .67-.06 1.33-.16 1.97h-.01v.91h-.03c0 .47.36.83.83.83h22.67c.47 0 .83-.36.83-.83ZM7.6 17.45c-1.84 0-3.34-1.5-3.34-3.34s1.5-3.34 3.34-3.34 3.34 1.5 3.34 3.34-1.5 3.34-3.34 3.34Zm8.83 0c-.92 0-1.76-.35-2.41-.94l1.69-1.69c.28.18.6.28.95.28 1.03 0 1.86-.84 1.86-1.86s-.84-1.86-1.86-1.86-1.86.84-1.86 1.86c0 .35.1.67.28.95l-1.69 1.69c-.59-.65-.94-1.49-.94-2.41 0-1.84 1.5-3.34 3.34-3.34s3.34 1.5 3.34 3.34-1.5 3.34-3.34 3.34Zm-4.42 2.17c-2.67 0-5.18-1.05-7.07-2.93l1.41-1.41c1.5 1.5 3.54 2.34 5.66 2.34s4.16-.84 5.66-2.34l1.41 1.41c-1.88 1.89-4.4 2.93-7.07 2.93Z"
                  />
                </svg>
                {t('signup.signUpWithGoogle')}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full hover:bg-gray-800/50 border-gray-700/50 text-gray-300"
            onClick={() => handleOAuthSignup('github')}
            disabled={loading}
          >
            {loading ? (
              t('common.loading')
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" />
                {t('signup.signUpWithGithub')}
              </>
            )}
          </Button>
          <div className="text-center text-sm text-gray-500">
            <Link to="/login" className="hover:text-tradeiq-blue">
              {t('signup.alreadyHaveAccount')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
