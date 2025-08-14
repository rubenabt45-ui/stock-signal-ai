import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Invalid or missing token');
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please choose a stronger password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully.",
        variant: "default",
      });

      navigate('/app/login');
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-col items-center space-y-2 pb-4">
          <CardTitle className="text-3xl font-bold text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-400">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-300">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {confirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <PasswordStrengthIndicator 
              password={password}
              onStrengthChange={setPasswordStrength}
            />
            <Button disabled={loading} className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4V2m0 16v2m8-8h2M4 12H2M17.66 6.34l1.42-1.42M4.93 18.37l1.42-1.42M19.07 17.66l-1.42 1.42M6.34 4.93L4.93 6.34" /></svg>
                  Updating...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
