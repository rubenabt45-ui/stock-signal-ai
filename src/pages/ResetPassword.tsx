import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartCandlestick, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { LanguageSelector } from '@/components/LanguageSelector';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { t } = useTranslationWithFallback();

  useEffect(() => {
    // Check if token is present in URL
    const token = searchParams.get('token');
    if (!token) {
      setAlertMessage(t('resetPassword.invalidToken'));
      setAlertType('error');
      setShowAlert(true);
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlertMessage(t('resetPassword.passwordsNotMatch'));
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    if (password.length < 8) {
      setAlertMessage(t('resetPassword.passwordTooShort'));
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    try {
      await updatePassword(password);
      setAlertMessage(t('resetPassword.passwordUpdated'));
      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setAlertMessage(error.message || t('resetPassword.updateFailed'));
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LanguageSelector />
      <Card className="tradeiq-card w-full max-w-md">
        <CardHeader className="space-y-1">
          <ChartCandlestick className="h-6 w-6 mb-2" />
          <CardTitle className="text-2xl text-white">{t('resetPassword.title')}</CardTitle>
          <CardDescription className="text-gray-400">{t('resetPassword.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {showAlert && (
            <Alert variant={alertType}>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-white">{t('resetPassword.newPassword')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="tradeiq-input pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <PasswordStrengthIndicator password={password} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-white">{t('resetPassword.confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="tradeiq-input pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button className="bg-tradeiq-blue text-white hover:bg-tradeiq-blue/90" onClick={handleSubmit}>
            {t('resetPassword.resetButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
