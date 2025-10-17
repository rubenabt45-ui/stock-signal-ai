
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle, XCircle, Eye, EyeOff, AlertTriangle, Loader } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { supabase } from '@/integrations/supabase/client';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import BackToHomeButton from '@/components/BackToHomeButton';
import tradeiqLogo from '@/assets/tradeiq-logo.png';

type ResetPasswordStatus = 'validating' | 'form' | 'success' | 'error' | 'expired';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslationWithFallback();
  const { updatePassword } = useAuth();
  
  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Flow state
  const [status, setStatus] = useState<ResetPasswordStatus>('validating');
  const [retryCount, setRetryCount] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const validateTokenAndSession = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const type = searchParams.get('type');
      
      console.log('🔐 [PASSWORD_RESET] Reset password page loaded');
      console.log('🔐 [PASSWORD_RESET] URL parameters:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        error,
        errorDescription,
        type,
        fullUrl: window.location.href
      });
      
      // Check for URL errors first
      if (error) {
        console.error('🔐 [PASSWORD_RESET_FAILED] URL contains error:', error, errorDescription);
        
        if (error === 'access_denied' || errorDescription?.includes('expired')) {
          setStatus('expired');
          setErrorMessage(t('auth.resetPassword.linkExpired'));
          toast({
            title: t('auth.resetPassword.linkExpired'),
            description: t('auth.resetPassword.linkExpiredDescription'),
            variant: "destructive",
          });
        } else {
          setStatus('error');
          setErrorMessage(t('auth.resetPassword.invalidLink'));
          toast({
            title: t('auth.resetPassword.invalidLink'),
            description: t('auth.resetPassword.invalidLinkDescription'),
            variant: "destructive",
          });
        }
        return;
      }
      
      // Check if this is a password recovery request
      if (type !== 'recovery') {
        console.error('🔐 [PASSWORD_RESET_FAILED] Invalid token type:', type);
        setStatus('error');
        setErrorMessage(t('auth.resetPassword.invalidLink'));
        toast({
          title: t('auth.resetPassword.invalidLink'),
          description: t('auth.resetPassword.invalidLinkDescription'),
          variant: "destructive",
        });
        return;
      }
      
      // Validate required tokens
      if (!accessToken || !refreshToken) {
        console.error('🔐 [PASSWORD_RESET_FAILED] Missing required tokens');
        setStatus('error');
        setErrorMessage(t('auth.resetPassword.invalidLink'));
        toast({
          title: t('auth.resetPassword.invalidLink'),
          description: t('auth.resetPassword.invalidLinkDescription'),
          variant: "destructive",
        });
        return;
      }

      try {
        // Set the session using the tokens from the URL
        console.log('🔐 [PASSWORD_RESET] Setting session with tokens...');
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('🔐 [PASSWORD_RESET_FAILED] Session error:', sessionError);
          
          if (sessionError.message.includes('expired') || sessionError.message.includes('invalid')) {
            setStatus('expired');
            setErrorMessage(t('auth.resetPassword.sessionExpired'));
            toast({
              title: t('auth.resetPassword.sessionExpired'),
              description: t('auth.resetPassword.sessionExpiredDescription'),
              variant: "destructive",
            });
          } else {
            setStatus('error');
            setErrorMessage(sessionError.message || t('auth.resetPassword.tokenValidationFailed'));
            toast({
              title: t('auth.resetPassword.error'),
              description: sessionError.message || t('auth.resetPassword.tokenValidationFailed'),
              variant: "destructive",
            });
          }
          return;
        }

        if (!sessionData.session || !sessionData.user) {
          console.error('🔐 [PASSWORD_RESET_FAILED] No session or user after setting session');
          setStatus('error');
          setErrorMessage(t('auth.resetPassword.invalidSession'));
          toast({
            title: t('auth.resetPassword.error'),
            description: t('auth.resetPassword.invalidSession'),
            variant: "destructive",
          });
          return;
        }

        // Verify the session is valid for password reset
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('🔐 [PASSWORD_RESET_FAILED] Failed to get user after session set:', userError);
          setStatus('expired');
          setErrorMessage(t('auth.resetPassword.sessionExpired'));
          toast({
            title: t('auth.resetPassword.sessionExpired'),
            description: t('auth.resetPassword.sessionExpiredDescription'),
            variant: "destructive",
          });
          return;
        }
        
        // If we reach here, the token is valid
        console.log('🔐 [PASSWORD_RESET] Token validation successful, user:', user.email);
        setTokenValidated(true);
        setStatus('form');
        
        toast({
          title: t('auth.resetPassword.tokenValidated'),
          description: t('auth.resetPassword.tokenValidatedDescription'),
        });
        
      } catch (error: any) {
        console.error('🔐 [PASSWORD_RESET_FAILED] Token validation exception:', error);
        setStatus('error');
        setErrorMessage(t('auth.resetPassword.unexpectedError'));
        toast({
          title: t('auth.resetPassword.error'),
          description: t('auth.resetPassword.unexpectedError'),
          variant: "destructive",
        });
      }
    };
    
    validateTokenAndSession();
  }, [searchParams, toast, t]);

  // Countdown for redirect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/login?password_updated=true');
    }
  }, [status, countdown, navigate]);

  const validatePassword = (password: string) => {
    const requirements = [
      { test: (pwd: string) => pwd.length >= 8, message: t('auth.resetPassword.passwordTooShort') },
      { test: (pwd: string) => /[A-Z]/.test(pwd), message: t('auth.resetPassword.passwordNeedsUppercase') },
      { test: (pwd: string) => /[a-z]/.test(pwd), message: t('auth.resetPassword.passwordNeedsLowercase') },
      { test: (pwd: string) => /\d/.test(pwd), message: t('auth.resetPassword.passwordNeedsNumber') },
      { test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), message: t('auth.resetPassword.passwordNeedsSpecial') }
    ];
    
    for (const requirement of requirements) {
      if (!requirement.test(password)) {
        return requirement.message;
      }
    }
    
    return null;
  };

  const isPasswordValid = () => {
    return validatePassword(password) === null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 [PASSWORD_RESET] Form submission started');
    
    if (!tokenValidated) {
      console.error('🔐 [PASSWORD_RESET_FAILED] Token not validated');
      toast({
        title: t('auth.resetPassword.error'),
        description: t('auth.resetPassword.invalidSession'),
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      console.error('🔐 [PASSWORD_RESET_FAILED] Passwords do not match');
      toast({
        title: t('auth.resetPassword.error'),
        description: t('auth.resetPassword.passwordsDoNotMatch'),
        variant: "destructive",
      });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      console.error('🔐 [PASSWORD_RESET_FAILED] Password validation failed:', passwordError);
      toast({
        title: t('auth.resetPassword.passwordRequirements'),
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setRetryCount(prev => prev + 1);
    
    console.log('🔐 [PASSWORD_RESET] Password update attempt #' + (retryCount + 1));
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('🔐 [PASSWORD_RESET_FAILED] Password update failed:', error);
        
        if (error.message.includes('expired') || error.message.includes('invalid') || error.message.includes('session')) {
          setStatus('expired');
          setErrorMessage(t('auth.resetPassword.sessionExpired'));
          toast({
            title: t('auth.resetPassword.sessionExpired'),
            description: t('auth.resetPassword.sessionExpiredDescription'),
            variant: "destructive",
          });
        } else {
          setStatus('error');
          setErrorMessage(error.message || t('auth.resetPassword.updateFailed'));
          toast({
            title: t('auth.resetPassword.error'),
            description: error.message || t('auth.resetPassword.updateFailed'),
            variant: "destructive",
          });
        }
      } else {
        console.log('🔐 [PASSWORD_RESET_SUCCESS] Password updated successfully');
        setStatus('success');
        toast({
          title: t('auth.resetPassword.success'),
          description: t('auth.resetPassword.successDescription'),
        });
        
        // Clear the session after successful password reset
        await supabase.auth.signOut();
        
        // Start countdown
        setCountdown(3);
      }
    } catch (error: any) {
      console.error('🔐 [PASSWORD_RESET_FAILED] Password update exception:', error);
      setStatus('error');
      setErrorMessage(t('auth.resetPassword.unexpectedError'));
      toast({
        title: t('auth.resetPassword.error'),
        description: t('auth.resetPassword.unexpectedError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    console.log('🔐 [PASSWORD_RESET] User requesting new reset link');
    navigate('/reset-password-request');
  };

  const handleGoToLogin = () => {
    navigate('/login?password_updated=true');
  };

  const renderNavigation = () => (
    <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={tradeiqLogo} alt="TradeIQ Logo" className="h-8" />
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </div>
        
        <div className="flex items-center space-x-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
            {t('auth.resetPassword.backToLogin')}
          </Button>
        </div>
      </div>
    </nav>
  );

  // Show loading state while validating token
  if (status === 'validating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {renderNavigation()}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-tradeiq-blue/20 rounded-full">
                    <Loader className="h-8 w-8 text-tradeiq-blue animate-spin" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">
                  {t('auth.resetPassword.validatingToken')}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="text-gray-400">
                  {t('auth.resetPassword.validatingTokenDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show expired token screen
  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {renderNavigation()}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">
                  {t('auth.resetPassword.linkExpired')}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <p className="text-gray-400">
                  {errorMessage || t('auth.resetPassword.linkExpiredDescription')}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleRequestNewLink}
                    className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                  >
                    {t('auth.resetPassword.requestNewLink')}
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    {t('auth.resetPassword.backToLogin')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center">
              <BackToHomeButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {renderNavigation()}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <XCircle className="h-8 w-8 text-red-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">
                  {t('auth.resetPassword.error')}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <p className="text-gray-400">
                  {errorMessage || t('auth.resetPassword.invalidLinkDescription')}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleRequestNewLink}
                    className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                  >
                    {t('auth.resetPassword.requestNewLink')}
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    {t('auth.resetPassword.backToLogin')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center">
              <BackToHomeButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success screen
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {renderNavigation()}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">
                  {t('auth.resetPassword.passwordUpdated')}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <p className="text-green-400">
                  {t('auth.resetPassword.successMessage')}
                </p>
                <p className="text-gray-400 text-sm">
                  {t('auth.resetPassword.redirectingToLogin')} {countdown > 0 && `(${countdown}s)`}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleGoToLogin}
                    className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                  >
                    {t('auth.resetPassword.goToLogin')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center">
              <BackToHomeButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show password reset form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {renderNavigation()}
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-tradeiq-blue/20 rounded-full">
                  <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                {t('auth.resetPassword.setNewPassword')}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    {t('auth.resetPassword.newPassword')}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.resetPassword.enterNewPassword')}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                      required
                      minLength={8}
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

                {/* Password Strength Indicator */}
                {password && (
                  <PasswordStrengthIndicator 
                    password={password} 
                    className="bg-gray-700/30 p-3 rounded-lg"
                  />
                )}

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    {t('auth.resetPassword.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.resetPassword.confirmNewPassword')}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Match Validation */}
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-400 flex items-center space-x-1">
                      <XCircle className="h-3 w-3" />
                      <span>{t('auth.resetPassword.passwordsDoNotMatch')}</span>
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length > 0 && (
                    <p className="text-sm text-green-400 flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>{t('auth.resetPassword.passwordsMatch')}</span>
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                  disabled={loading || !tokenValidated || !isPasswordValid() || password !== confirmPassword}
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      {t('auth.resetPassword.updating')}
                    </>
                  ) : (
                    t('auth.resetPassword.updatePassword')
                  )}
                  {retryCount > 0 && ` (${t('auth.resetPassword.attempt')} ${retryCount})`}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <BackToHomeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
