import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartCandlestick, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { LanguageSelector } from '@/components/LanguageSelector';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { t } = useTranslationWithFallback();

  useEffect(() => {
    document.title = t('resetPasswordRequest.title') + ' | TradeIQ';
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('resetPasswordRequest.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-6 tradeiq-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Link to="/login" className="mr-2">
              <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-gray-300" />
            </Link>
            <CardTitle className="text-2xl font-bold text-white">{t('resetPasswordRequest.title')}</CardTitle>
          </div>
          <CardDescription className="text-gray-400">{t('resetPasswordRequest.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{t('resetPasswordRequest.successMessage')}</AlertDescription>
            </Alert>
          )}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">{t('resetPasswordRequest.emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-tradeiq-blue"
                  placeholder={t('resetPasswordRequest.emailPlaceholder')}
                />
              </div>
              <Button disabled={loading} className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90">
                {loading ? t('common.loading') : t('resetPasswordRequest.resetButton')}
              </Button>
            </form>
          )}
        </CardContent>
        <div className="px-6 pb-6 text-center text-sm text-gray-500">
          <LanguageSelector />
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordRequest;
