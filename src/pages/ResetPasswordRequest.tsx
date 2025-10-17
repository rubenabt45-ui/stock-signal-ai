
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/providers/FakeAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import BackToHomeButton from '@/components/BackToHomeButton';
import { PageWrapper } from '@/components/PageWrapper';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslationWithFallback();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t('auth.resetPasswordRequest.emailRequired'),
        description: t('auth.resetPasswordRequest.enterEmail'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('🔐 [PASSWORD_RESET_REQUESTED] Initiating password reset for:', email);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        console.error('🔐 [PASSWORD_RESET_FAILED] Password reset failed:', error);
        toast({
          title: t('auth.resetPasswordRequest.error'),
          description: error.message || t('auth.resetPasswordRequest.failedToSend'),
          variant: "destructive",
        });
      } else {
        console.log('🔐 [PASSWORD_RESET_SUCCESS] Password reset email sent successfully to:', email);
        setSent(true);
        toast({
          title: t('auth.resetPasswordRequest.emailSent'),
          description: t('auth.resetPasswordRequest.checkEmail'),
        });
      }
    } catch (error) {
      console.error('🔐 [PASSWORD_RESET_FAILED] Password reset exception:', error);
      toast({
        title: t('auth.resetPasswordRequest.error'),
        description: t('auth.resetPasswordRequest.unexpectedError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper pageName="ResetPasswordRequest">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Navigation */}
        <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
              <span className="text-xl font-bold">TradeIQ</span>
              <Badge variant="secondary" className="text-xs">BETA</Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                {t('common.home')}
              </Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                {t('common.pricing')}
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">{t('auth.login.signIn')}</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-tradeiq-blue/20 rounded-full">
                    {sent ? (
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    ) : (
                      <Mail className="h-8 w-8 text-tradeiq-blue" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">
                  {sent ? t('auth.resetPasswordRequest.checkEmailTitle') : t('auth.resetPasswordRequest.title')}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {sent 
                    ? t('auth.resetPasswordRequest.emailSentDescription', { email })
                    : t('auth.resetPasswordRequest.subtitle')
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {sent ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-400 text-sm">
                          {t('auth.resetPasswordRequest.instructionsSent')}
                        </p>
                      </div>
                      
                      <p className="text-xs text-gray-400">
                        {t('auth.resetPasswordRequest.didntReceive')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setSent(false)}
                        variant="outline" 
                        className="w-full"
                      >
                        {t('auth.resetPasswordRequest.sendAnother')}
                      </Button>
                      
                      <Link to="/login">
                        <Button variant="ghost" className="w-full">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          {t('auth.resetPasswordRequest.backToLogin')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-300">
                        {t('auth.resetPasswordRequest.emailLabel')}
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('placeholders.enterEmail')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                      disabled={loading}
                    >
                      {loading ? t('auth.resetPasswordRequest.sending') : t('auth.resetPasswordRequest.sendButton')}
                    </Button>

                    <div className="text-center">
                      <Link 
                        to="/login" 
                        className="text-sm text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors inline-flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        {t('auth.resetPasswordRequest.backToLogin')}
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-400">
                {t('auth.login.noAccount')}{' '}
                <Link to="/signup" className="text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors">
                  {t('auth.login.signUp')}
                </Link>
              </p>
              
              <div className="max-w-md mx-auto">
                <BackToHomeButton />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm py-8 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-gray-400">
              © 2024 TradeIQ. {t('footer.allRightsReserved')}
            </p>
          </div>
        </footer>
      </div>
    </PageWrapper>
  );
};

export default ResetPasswordRequest;
