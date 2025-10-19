
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';
import { logger } from '@/utils/logger';

interface DailyUsage {
  analysisCount: number;
  maxAnalysisPerDay: number;
  canUseAnalysis: boolean;
  remainingAnalysis: number;
  lastAnalysisDate: string | null;
  loading: boolean;
}

export const useDailyMessages = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({
    analysisCount: 0,
    maxAnalysisPerDay: 3,
    canUseAnalysis: true,
    remainingAnalysis: 3,
    lastAnalysisDate: null,
    loading: true
  });

  // Check daily analysis usage for free users (3 per 24h)
  const checkDailyAnalysisUsage = async () => {
    if (!user?.id || isPro) {
      setDailyUsage(prev => ({ 
        ...prev, 
        loading: false, 
        canUseAnalysis: true, 
        remainingAnalysis: isPro ? 999 : 3 
      }));
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('daily_message_count, daily_message_reset')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        logger.error('[DAILY_USAGE] Error fetching usage:', error);
        setDailyUsage(prev => ({ ...prev, loading: false }));
        return;
      }

      const today = new Date().toDateString();
      const lastReset = profile?.daily_message_reset;
      const currentCount = profile?.daily_message_count || 0;
      
      // Check if we need to reset the counter (new day)
      const needsReset = !lastReset || new Date(lastReset).toDateString() !== today;
      
      let finalCount = currentCount;
      if (needsReset) {
        // Reset counter for new day
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            daily_message_count: 0,
            daily_message_reset: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);

        if (!updateError) {
          finalCount = 0;
        }
      }
      
      const maxAnalysis = 3;
      const remaining = Math.max(0, maxAnalysis - finalCount);
      const canUse = remaining > 0;
      
      setDailyUsage({
        analysisCount: finalCount,
        maxAnalysisPerDay: maxAnalysis,
        canUseAnalysis: canUse,
        remainingAnalysis: remaining,
        lastAnalysisDate: lastReset,
        loading: false
      });
      
      logger.debug('[DAILY_USAGE] Usage check complete:', {
        count: finalCount,
        remaining,
        canUse,
        needsReset
      });
      
    } catch (error) {
      logger.error('[DAILY_USAGE] Exception checking usage:', error);
      setDailyUsage(prev => ({ ...prev, loading: false }));
    }
  };

  // Record analysis usage (increment counter)
  const recordAnalysisUsage = async () => {
    if (!user?.id || isPro) return true;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('daily_message_count')
        .eq('user_id', user.id)
        .maybeSingle();

      const newCount = (profile?.daily_message_count || 0) + 1;

      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          daily_message_count: newCount,
          daily_message_reset: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', user.id);

      if (error) {
        logger.error('[DAILY_USAGE] Error recording usage:', error);
        return false;
      }

      // Update local state
      setDailyUsage(prev => ({
        ...prev,
        analysisCount: newCount,
        remainingAnalysis: Math.max(0, prev.maxAnalysisPerDay - newCount),
        canUseAnalysis: newCount < prev.maxAnalysisPerDay
      }));

      logger.debug('[DAILY_USAGE] Analysis usage recorded:', newCount);
      return true;
      
    } catch (error) {
      logger.error('[DAILY_USAGE] Exception recording usage:', error);
      return false;
    }
  };

  // Get time until reset (24h from last reset)
  const getTimeUntilReset = () => {
    if (isPro || !dailyUsage.lastAnalysisDate) return null;
    
    const lastReset = new Date(dailyUsage.lastAnalysisDate);
    const nextReset = new Date(lastReset);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0); // Reset at midnight
    
    const now = new Date();
    
    if (now >= nextReset) return null;
    
    const msRemaining = nextReset.getTime() - now.getTime();
    const hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60));
    
    return hoursRemaining;
  };

  useEffect(() => {
    checkDailyAnalysisUsage();
  }, [user?.id, isPro]);

  return {
    // Analysis-specific properties
    analysisCount: dailyUsage.analysisCount,
    maxAnalysisPerDay: dailyUsage.maxAnalysisPerDay,
    canUseAnalysis: dailyUsage.canUseAnalysis,
    remainingAnalysis: dailyUsage.remainingAnalysis,
    recordAnalysisUsage,
    
    // Legacy properties for backward compatibility
    hasUsedFreeAnalysis: dailyUsage.analysisCount > 0,
    lastAnalysisDate: dailyUsage.lastAnalysisDate,
    canUseFreeAnalysis: dailyUsage.canUseAnalysis,
    recordFreeAnalysisUsage: recordAnalysisUsage,
    getTimeUntilNextFreeAnalysis: getTimeUntilReset,
    
    // General properties
    loading: dailyUsage.loading,
    refreshUsage: checkDailyAnalysisUsage,
    isPro
  };
};
