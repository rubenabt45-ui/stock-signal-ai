
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle, XCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import BackToHomeButton from '@/components/BackToHomeButton';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'form' | 'success' | 'error' | 'expired'>('form');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    console.log('🔐 [PASSWORD_RESET] Reset password page loaded');
    console.log('🔐 [PASSWORD_RESET] Access token present:', !!accessToken);
    console.log('🔐 [PASSWORD_RESET] Refresh token present:', !!refreshToken);
    console.log('🔐 [EMAIL_MONITORING] Password reset token validation');
    
    if (error) {
      console.error('🔐 [PASSWORD_RESET] URL contains error:', error, errorDescription);
      console.error('🔐 [EMAIL_MONITORING] Password reset token invalid or expired');
      
      if (error === 'access_denied' || errorDescription?.includes('expired')) {
        setStatus('expired');
        toast({
          title: "Reset Link Expired",
          description: "Your password reset link has expired. Please request a new one.",
          variant: "destructive",
        });
      } else {
        setStatus('error');
        toast({
          title: "Invalid Reset Link",
          description: "The password reset link is invalid. Please request a new one.",
          variant: "destructive",
        });
      }
      return;
    }
    
    if (!accessToken || !refreshToken) {
      console.error('🔐 [PASSWORD_RESET] Missing tokens, redirecting to login');
      console.error('🔐 [EMAIL_MONITORING] Password reset token missing');
      setStatus('error');
      navigate('/login?error=invalid_reset_link');
    } else {
      console.log('🔐 [EMAIL_MONITORING] Password reset token validated successfully');
    }
  }, [searchParams, navigate, toast]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Password Requirements",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setRetryCount(prev => prev + 1);
    
    console.log('🔐 [PASSWORD_RESET] Password update attempt #' + (retryCount + 1));
    console.log('🔐 [EMAIL_MONITORING] Password reset completion initiated');
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('🔐 [PASSWORD_RESET] Password update failed:', error);
        console.error('🔐 [EMAIL_MONITORING] Password reset completion failed:', error);
        
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          setStatus('expired');
          toast({
            title: "Session Expired",
            description: "Your password reset session has expired. Please request a new password reset link.",
            variant: "destructive",
          });
        } else {
          setStatus('error');
          toast({
            title: "Error",
            description: error.message || "Failed to update password. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        console.log('🔐 [PASSWORD_RESET] Password updated successfully');
        console.log('🔐 [EMAIL_MONITORING] Password reset completion successful');
        setStatus('success');
        toast({
          title: "Success",
          description: "Password updated successfully! Redirecting to login...",
        });
        
        setTimeout(() => {
          navigate('/login?password_updated=true');
        }, 2000);
      }
    } catch (error) {
      console.error('🔐 [PASSWORD_RESET] Password update exception:', error);
      console.error('🔐 [EMAIL_MONITORING] Password reset completion exception:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    console.log('🔐 [PASSWORD_RESET] User requesting new reset link');
    navigate('/forgot-password');
  };

  if (status === 'expired') {
    return (
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
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Back to Login
              </Button>
            </div>
          </div>
        </nav>

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
                  Reset Link Expired
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <p className="text-gray-400">
                  Your password reset link has expired or is no longer valid. Please request a new password reset link.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleRequestNewLink}
                    className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                  >
                    Request New Reset Link
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Login
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

  return (
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
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
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
                  {status === 'success' ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : status === 'error' ? (
                    <XCircle className="h-8 w-8 text-red-400" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                {status === 'success' ? 'Password Updated!' : 
                 status === 'error' ? 'Update Failed' : 
                 'Set New Password'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {status === 'success' ? (
                <div className="text-center space-y-4">
                  <p className="text-green-400">
                    Your password has been successfully updated. You will be redirected to the login page shortly.
                  </p>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                  >
                    Go to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
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
                    <div className="text-xs text-gray-400">
                      Password must contain at least 8 characters with uppercase, lowercase, numbers, and special characters.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
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
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                    disabled={loading}
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                    {retryCount > 0 && ` (Attempt ${retryCount})`}
                  </Button>
                  
                  {status === 'error' && (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleRequestNewLink}
                        variant="outline"
                        className="w-full"
                      >
                        Request New Reset Link
                      </Button>
                    </div>
                  )}
                </form>
              )}
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
