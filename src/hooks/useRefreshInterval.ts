
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useRefreshInterval = () => {
  const [refreshInterval, setRefreshInterval] = useState<string>('1min');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRefreshInterval = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('refresh_interval')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setRefreshInterval(data.refresh_interval || '1min');
          }
        } catch (error) {
          console.error('Error fetching refresh interval:', error);
        }
      }
    };

    fetchRefreshInterval();
  }, [user]);

  const getIntervalMs = () => {
    switch (refreshInterval) {
      case '30s': return 30000;
      case '1min': return 60000;
      case '5min': return 300000;
      default: return 60000;
    }
  };

  return {
    refreshInterval,
    intervalMs: getIntervalMs(),
  };
};
