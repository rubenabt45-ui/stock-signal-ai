
import { useTranslation } from 'react-i18next';
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

const Settings = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('nav.settings')}>
      <div className="space-y-6">
        <ProfileSection />
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
