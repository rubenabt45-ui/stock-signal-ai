
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageWrapper } from '@/components/PageWrapper';
import { ProfileSection } from '@/components/ProfileSection';
import { SecuritySection } from '@/components/SecuritySection';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { PreferencesSection } from '@/components/PreferencesSection';
import { NotificationsSection } from '@/components/NotificationsSection';
import { IntegrationsSection } from '@/components/IntegrationsSection';
import { SupportSection } from '@/components/SupportSection';
import { LegalSection } from '@/components/LegalSection';
import { LogoutSection } from '@/components/LogoutSection';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile.",
            variant: "destructive",
          });
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  if (loading) {
    return (
      <PageWrapper pageName="Settings">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue"></div>
        </div>
      </PageWrapper>
    );
  }

  if (!user) {
    return (
      <PageWrapper pageName="Settings">
        <div className="text-center text-gray-400">
          Please log in to access settings.
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pageName="Settings">
      <div className="space-y-6">
        <ProfileSection 
          user={user}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
        <SecuritySection />
        <SecurityMonitor />
        <PreferencesSection />
        <NotificationsSection />
        <IntegrationsSection />
        <SupportSection />
        <LegalSection />
        <LogoutSection />
      </div>
    </PageWrapper>
  );
};

export default Settings;
