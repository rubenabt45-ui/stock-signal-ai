import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            is_subscribed: isSubscribed,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Signup Successful",
        description: "We've sent a confirmation link to your email.",
      });

      navigate('/app/login');
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 tradeiq-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Start your journey with TradeIQ today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-tradeiq-card border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-tradeiq-card border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrengthIndicator 
                password={password}
                onStrengthChange={setPasswordStrength}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-white">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-tradeiq-card border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="subscribe"
                checked={isSubscribed}
                onCheckedChange={setIsSubscribed}
                className="mr-2"
              />
              <Label htmlFor="subscribe" className="text-white text-sm">
                Subscribe to newsletter
              </Label>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full tradeiq-button-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </>
                ) : (
                  'Sign up'
                )}
              </Button>
            </div>
          </form>
          <div className="text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link to="/app/login" className="text-tradeiq-blue hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
