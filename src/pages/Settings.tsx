
import { Settings as SettingsIcon, Crown, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import PlanModal from "@/components/PlanModal";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSection } from "@/components/ProfileSection";
import { PreferencesSection } from "@/components/PreferencesSection";
import { SecuritySection } from "@/components/SecuritySection";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { SupportSection } from "@/components/SupportSection";
import { LegalSection } from "@/components/LegalSection";
import { LogoutSection } from "@/components/LogoutSection";
import { NotificationsSection } from "@/components/NotificationsSection";
import { SubscriptionDashboard } from "@/components/SubscriptionDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
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
          // Don't throw - continue with null profile
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
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{t('settings.title')}</h1>
                <p className="text-sm text-gray-400 font-medium">{t('settings.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-400 text-sm">
              <strong>Warning:</strong> {error}. Some features may not work properly.
            </div>
          </div>
        )}

        {/* Profile Section */}
        <ErrorBoundary componentName="Profile Section">
          <ProfileSection 
            user={user} 
            userProfile={userProfile} 
            onProfileUpdate={handleProfileUpdate}
          />
        </ErrorBoundary>

        {/* Subscription Dashboard */}
        <ErrorBoundary componentName="Subscription Dashboard">
          <SubscriptionDashboard />
        </ErrorBoundary>

        {/* Notifications Section */}
        <ErrorBoundary componentName="Notifications Section">
          <NotificationsSection />
        </ErrorBoundary>

        {/* Preferences Section */}
        <ErrorBoundary componentName="Preferences Section">
          <PreferencesSection />
        </ErrorBoundary>

        {/* Security Section */}
        <ErrorBoundary componentName="Security Section">
          <SecuritySection />
        </ErrorBoundary>

        {/* Pro Subscription Management */}
        {isPro && (
          <ErrorBoundary componentName="Pro Subscription Management">
            <div className="tradeiq-card border-green-500/20 bg-black/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="h-5 w-5 text-green-500" />
                <h3 className="text-white text-lg font-semibold">{t('settings.pro.title') || 'Pro Features'}</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium">{t('settings.pro.currentPlan') || 'Current Plan'}</p>
                  <p className="text-green-400 text-sm">{t('settings.pro.proPlan') || 'Pro Plan'}</p>
                </div>
                <div>
                  <p className="text-white font-medium">{t('settings.pro.benefits') || 'Benefits'}</p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    {(() => {
                      try {
                        const benefits = t('settings.pro.benefitsList', { returnObjects: true }) as string[];
                        return Array.isArray(benefits) ? benefits.map((benefit: string, index: number) => (
                          <li key={index}>• {benefit}</li>
                        )) : <li>• Unlimited access to all features</li>;
                      } catch {
                        return <li>• Unlimited access to all features</li>;
                      }
                    })()}
                  </ul>
                </div>
                <div className="text-gray-500 text-xs">
                  <p>{t('settings.pro.managedBy') || 'Managed through Stripe'}</p>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* Integrations Section */}
        <ErrorBoundary componentName="Integrations Section">
          <IntegrationsSection />
        </ErrorBoundary>

        {/* Support Section */}
        <ErrorBoundary componentName="Support Section">
          <SupportSection />
        </ErrorBoundary>

        {/* Legal Section */}
        <ErrorBoundary componentName="Legal Section">
          <LegalSection />
        </ErrorBoundary>

        {/* Logout Section */}
        <ErrorBoundary componentName="Logout Section">
          <LogoutSection />
        </ErrorBoundary>
      </main>

      {/* Plan Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />
    </div>
  );
};

export default Settings;
