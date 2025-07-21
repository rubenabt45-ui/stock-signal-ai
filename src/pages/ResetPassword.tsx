
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
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
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    console.log('🔐 [PASSWORD_RESET] Reset password page loaded');
    console.log('🔐 [PASSWORD_RESET] Access token present:', !!accessToken);
    console.log('🔐 [PASSWORD_RESET] Refresh token present:', !!refreshToken);
    
    if (!accessToken || !refreshToken) {
      console.error('🔐 [PASSWORD_RESET] Missing tokens, redirecting to login');
      navigate('/login?error=invalid_reset_link');
    }
  }, [searchParams, navigate]);

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

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('🔐 [PASSWORD_RESET] Password update failed:', error);
        setStatus('error');
        toast({
          title: "Error",
          description: error.message || "Failed to update password",
          variant: "destructive",
        });
      } else {
        console.log('🔐 [PASSWORD_RESET] Password updated successfully');
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
      setStatus('error');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                        placeholder="Enter new password (min 8 characters)"
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
                  </Button>
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
