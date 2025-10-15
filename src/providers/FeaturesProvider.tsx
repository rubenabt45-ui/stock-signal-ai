import React, { createContext, useContext } from 'react';
import { useFakeAuth } from './FakeAuthProvider';

interface FeaturesContextType {
  isPro: boolean;
  hasFeature: (feature: string) => boolean;
  dailyMessageCount: number;
  dailyMessageLimit: number;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (!context) {
    throw new Error('useFeatures must be used within FeaturesProvider');
  }
  return context;
};

export const FeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useFakeAuth();

  const isPro = userProfile?.is_pro || false;

  const proFeatures = [
    'advanced-analysis',
    'unlimited-charts',
    'priority-support',
    'custom-alerts',
    'export-data',
    'advanced-patterns',
    'strategy-ai',
  ];

  const hasFeature = (feature: string) => {
    if (isPro) return true;
    return !proFeatures.includes(feature);
  };

  const value: FeaturesContextType = {
    isPro,
    hasFeature,
    dailyMessageCount: userProfile?.daily_message_count || 0,
    dailyMessageLimit: userProfile?.daily_message_limit || 50,
  };

  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
};
