
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useSubscription } from '@/hooks/useSubscription';
import { logger } from '@/utils/logger';

interface DailyUsage {
  hasUsedFreeAnalysis: boolean;
  lastAnalysisDate: string | null;
  canUseFreeAnalysis: boolean;
  loading: boolean;
}

export const useDailyMessages = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({
    hasUsedFreeAnalysis: false,
    lastAnalysisDate: null,
    canUseFreeAnalysis: true,
    loading: true
  });

  // Check if user can use free analysis (once per 24h for free users)
  const checkFreeAnalysisUsage = async () => {
    if (!user?.id || isPro) {
      setDailyUsage(prev => ({ ...prev, loading: false, canUseFreeAnalysis: true }));
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('last_free_analysis_at')
        .eq('id', user.id)
        .single();

      if (error) {
        logger.error('[DAILY_USAGE] Error fetching usage:', error);
        setDailyUsage(prev => ({ ...prev, loading: false }));
        return;
      }

      const lastAnalysisDate = profile?.last_free_analysis_at;
      const now = new Date();
      const lastAnalysis = lastAnalysisDate ? new Date(lastAnalysisDate) : null;
      
      // Check if 24 hours have passed since last free analysis
      const canUse = !lastAnalysis || (now.getTime() - lastAnalysis.getTime()) >= 24 * 60 * 60 * 1000;
      
      setDailyUsage({
        hasUsedFreeAnalysis: !!lastAnalysis,
        lastAnalysisDate,
        canUseFreeAnalysis: canUse,
        loading: false
      });
      
      logger.debug('[DAILY_USAGE] Usage check complete:', {
        lastAnalysis: lastAnalysisDate,
        canUse,
        hoursSinceLastUse: lastAnalysis ? (now.getTime() - lastAnalysis.getTime()) / (1000 * 60 * 60) : null
      });
      
    } catch (error) {
      logger.error('[DAILY_USAGE] Exception checking usage:', error);
      setDailyUsage(prev => ({ ...prev, loading: false }));
    }
  };

  // Record free analysis usage
  const recordFreeAnalysisUsage = async () => {
    if (!user?.id || isPro) return true;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          last_free_analysis_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        logger.error('[DAILY_USAGE] Error recording usage:', error);
        return false;
      }

      // Update local state
      setDailyUsage(prev => ({
        ...prev,
        hasUsedFreeAnalysis: true,
        lastAnalysisDate: new Date().toISOString(),
        canUseFreeAnalysis: false
      }));

      logger.debug('[DAILY_USAGE] Free analysis usage recorded');
      return true;
      
    } catch (error) {
      logger.error('[DAILY_USAGE] Exception recording usage:', error);
      return false;
    }
  };

  // Get time until next free analysis
  const getTimeUntilNextFreeAnalysis = () => {
    if (isPro || !dailyUsage.lastAnalysisDate) return null;
    
    const lastAnalysis = new Date(dailyUsage.lastAnalysisDate);
    const nextAllowed = new Date(lastAnalysis.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now >= nextAllowed) return null;
    
    const msRemaining = nextAllowed.getTime() - now.getTime();
    const hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60));
    
    return hoursRemaining;
  };

  useEffect(() => {
    checkFreeAnalysisUsage();
  }, [user?.id, isPro]);

  return {
    ...dailyUsage,
    recordFreeAnalysisUsage,
    getTimeUntilNextFreeAnalysis,
    refreshUsage: checkFreeAnalysisUsage
  };
};
