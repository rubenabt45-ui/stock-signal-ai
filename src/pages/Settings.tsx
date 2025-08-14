
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth/auth.provider";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { PageWrapper } from '@/components/PageWrapper';
import PlanModal from "@/components/PlanModal";
import { supabase } from "@/integrations/supabase/client";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsSections } from "@/components/settings/SettingsSections";

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslationWithFallback();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile to get pro status
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setError('Failed to load profile data');
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  const isPro = userProfile?.is_pro || false;

  // Show loading state while auth or profile is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="text-white text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto"></div>
          <div>{t('common.loading') || 'Loading...'}</div>
        </div>
      </div>
    );
  }

  // Show error state if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <div className="text-red-400">Authentication required</div>
          <div className="text-gray-400">Please log in to access settings</div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper pageName="Settings">
      <div className="min-h-screen bg-tradeiq-navy">
        <SettingsHeader />
        <SettingsSections
          user={user}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
          isPro={isPro}
          error={error}
        />

        {/* Plan Modal */}
        <PlanModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
        />
      </div>
    </PageWrapper>
  );
};

export default Settings;
