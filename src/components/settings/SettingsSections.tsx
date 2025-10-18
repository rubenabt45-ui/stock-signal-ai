
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
import { StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

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
    <main className="container mx-auto px-4 py-6 pb-24">
      <StaggerContainer>
        {/* Error Banner */}
        {error && (
          <StaggerItem>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="text-red-400 text-sm">
                <strong>Warning:</strong> {error}. Some features may not work properly.
              </div>
            </div>
          </StaggerItem>
        )}

        {/* Profile Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Profile Section">
            <ProfileSection 
              user={user} 
              userProfile={userProfile} 
              onProfileUpdate={onProfileUpdate}
            />
          </ErrorBoundary>
        </StaggerItem>

        {/* Subscription Dashboard */}
        <StaggerItem>
          <ErrorBoundary componentName="Subscription Dashboard">
            <SubscriptionDashboard />
          </ErrorBoundary>
        </StaggerItem>

        {/* Notifications Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Notifications Section">
            <NotificationsSection />
          </ErrorBoundary>
        </StaggerItem>

        {/* Preferences Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Preferences Section">
            <PreferencesSection />
          </ErrorBoundary>
        </StaggerItem>

        {/* Security Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Security Section">
            <SecuritySection />
          </ErrorBoundary>
        </StaggerItem>

        {/* Pro Features Section */}
        <StaggerItem>
          <ProFeaturesSection isPro={isPro} />
        </StaggerItem>

        {/* Integrations Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Integrations Section">
            <IntegrationsSection />
          </ErrorBoundary>
        </StaggerItem>

        {/* Support Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Support Section">
            <SupportSection />
          </ErrorBoundary>
        </StaggerItem>

        {/* Legal Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Legal Section">
            <LegalSection />
          </ErrorBoundary>
        </StaggerItem>

        {/* Logout Section */}
        <StaggerItem>
          <ErrorBoundary componentName="Logout Section">
            <LogoutSection />
          </ErrorBoundary>
        </StaggerItem>
      </StaggerContainer>
    </main>
  );
};
