
import { useState } from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client-fake';

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
        title: t('auth.signup.errors.passwordTooShort'),
        description: t('auth.resetPassword.passwordTooShort', { minLength: 8 }),
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t('auth.resetPassword.passwordsDoNotMatch'),
        description: t('auth.signup.errors.passwordsDoNotMatch'),
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
          title: t('settings.security.passwordUpdateFailed'),
          description: error.message || t('settings.security.passwordUpdateError'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('settings.security.passwordUpdated'),
          description: t('settings.security.passwordUpdateSuccess'),
        });
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: t('settings.security.passwordUpdateFailed'),
        description: t('settings.security.unexpectedError'),
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
          <CardTitle className="text-white">{t('settings.security.title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">
              {t('settings.security.currentPassword')}
            </Label>
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
            <Label htmlFor="newPassword" className="text-white">
              {t('settings.security.newPassword')}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('placeholders.enterNewPassword')}
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              {t('settings.security.confirmPassword')}
            </Label>
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
          </div>

          <Button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                {t('settings.security.updating')}
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                {t('settings.security.changePassword')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
