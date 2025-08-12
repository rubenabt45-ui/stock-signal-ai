
import { useState } from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SecuritySection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const { t } = useTranslationWithFallback();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (newPassword.length < 8) {
      toast({
        title: t('auth.signup.errors.passwordTooShort') || "Password too short",
        description: t('auth.resetPassword.passwordTooShort', { minLength: 8 }) || "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t('auth.resetPassword.passwordsDoNotMatch') || "Passwords don't match",
        description: t('auth.signup.errors.passwordsDoNotMatch') || "New password and confirmation don't match.",
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
        toast({
          title: t('settings.security.passwordUpdateFailed') || "Password update failed",
          description: error.message || t('settings.security.passwordUpdateError') || "Failed to update password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: t('settings.security.passwordUpdated') || "Password updated",
          description: t('settings.security.passwordUpdateSuccess') || "Your password has been updated successfully.",
        });
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: t('settings.security.passwordUpdateFailed') || "Password update failed",
        description: t('settings.security.unexpectedError') || "An unexpected error occurred. Please try again.",
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
          <CardTitle className="text-white">{t('settings.security.title') || 'Security'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">
              {t('settings.security.currentPassword') || 'Current Password'}
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('placeholders.enterCurrentPassword') || 'Enter current password'}
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white">
              {t('settings.security.newPassword') || 'New Password'}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('placeholders.enterNewPassword') || 'Enter new password'}
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              {t('settings.security.confirmPassword') || 'Confirm New Password'}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('placeholders.confirmNewPassword') || 'Confirm new password'}
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                {t('settings.security.updating') || 'Updating Password...'}
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                {t('settings.security.changePassword') || 'Change Password'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
