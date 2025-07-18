import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BackToHomeButton from '@/components/BackToHomeButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSent(true);
        toast({
          title: "Recovery email sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
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
                  <Mail className="h-8 w-8 text-tradeiq-blue" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                {sent ? 'Check Your Email' : 'Forgot Password?'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {sent 
                  ? `We've sent a password reset link to ${email}`
                  : 'Enter your email address and we\'ll send you a link to reset your password.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {sent ? (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm">
                        Password reset instructions have been sent to your email. 
                        Please check your inbox and follow the link to reset your password.
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-400">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setSent(false)}
                      variant="outline" 
                      className="w-full"
                    >
                      Send Another Email
                    </Button>
                    
                    <Link to="/login">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
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
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="text-sm text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors inline-flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors">
                Sign up for free
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
            © 2024 TradeIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;