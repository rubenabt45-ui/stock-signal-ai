
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProfileSection } from "@/components/ProfileSection";
import { SubscriptionDashboard } from "@/components/SubscriptionDashboard";
import { NotificationsSection } from "@/components/NotificationsSection";
import { PreferencesSection } from "@/components/PreferencesSection";
import { SecuritySection } from "@/components/SecuritySection";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { SupportSection } from "@/components/SupportSection";
import { LegalSection } from "@/components/LegalSection";
import { LogoutSection } from "@/components/LogoutSection";
import { ProFeaturesSection } from "./ProFeaturesSection";

interface SettingsSectionsProps {
  user: any;
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
  isPro: boolean;
  error?: string | null;
}

export const SettingsSections: React.FC<SettingsSectionsProps> = ({
  user,
  userProfile,
  onProfileUpdate,
  isPro,
  error
}) => {
  return (
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
          onProfileUpdate={onProfileUpdate}
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

      {/* Pro Features Section */}
      <ProFeaturesSection isPro={isPro} />

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
  );
};
