import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthProvider';

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
  const { user } = useAuth();

  // TODO: Load user profile from Supabase to check isPro status
  const isPro = false; // For now, all users are free tier

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
    dailyMessageCount: 0, // TODO: Load from Supabase
    dailyMessageLimit: 50,
  };

  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
};
