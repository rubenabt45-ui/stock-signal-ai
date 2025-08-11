
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export const SecuritySection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [], isValid: false });
  const { toast } = useToast();
  const { t } = useTranslation();

  const validatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (password.length >= 12) {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Include at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Include at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Include at least one number');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Include at least one special character');
    } else {
      score += 1;
    }

    // Check for common patterns
    const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111'];
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      feedback.push('Avoid common patterns and dictionary words');
      score = Math.max(0, score - 2);
    }

    return {
      score,
      feedback,
      isValid: score >= 4 && feedback.length === 0
    };
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setPasswordStrength(validatePasswordStrength(password));
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return 'text-red-500';
    if (score < 4) return 'text-yellow-500';
    if (score < 6) return 'text-blue-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Fair';
    if (score < 6) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!passwordStrength.isValid) {
      toast({
        title: "Password requirements not met",
        description: "Please address all password strength requirements.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword === currentPassword) {
      toast({
        title: "Invalid password change",
        description: "New password must be different from current password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        
        // Handle specific error cases
        if (error.message.includes('session_not_found')) {
          toast({
            title: "Authentication required",
            description: "Please log in again to change your password.",
            variant: "destructive",
          });
        } else if (error.message.includes('weak_password')) {
          toast({
            title: "Password too weak",
            description: "Please choose a stronger password.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Password update failed",
            description: error.message || "Failed to update password. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        });
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength({ score: 0, feedback: [], isValid: false });
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: "Password update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Security</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('placeholders.enterCurrentPassword')}
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder={t('placeholders.enterNewPassword')}
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
              required
              minLength={8}
            />
            
            {newPassword && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}>
                    Password Strength: {getPasswordStrengthText(passwordStrength.score)}
                  </div>
                  {passwordStrength.isValid && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                
                {passwordStrength.feedback.length > 0 && (
                  <div className="space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-yellow-400">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('placeholders.confirmNewPassword')}
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
              required
              minLength={8}
            />
            
            {confirmPassword && newPassword !== confirmPassword && (
              <div className="flex items-center space-x-2 text-sm text-red-400">
                <AlertTriangle className="h-3 w-3" />
                <span>Passwords do not match</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || !passwordStrength.isValid}
            className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
