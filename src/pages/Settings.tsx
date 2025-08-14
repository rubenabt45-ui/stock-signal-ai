
import React from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { useAuth } from '@/contexts/auth/auth.provider';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsSections } from '@/components/settings/SettingsSections';

const Settings = () => {
  const { user } = useAuth();

  return (
    <PageWrapper pageName="Settings">
      <div className="min-h-screen bg-tradeiq-navy p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <SettingsHeader />
          <SettingsSections 
            user={user}
            userProfile={null}
            onProfileUpdate={() => {}}
            isPro={false}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
