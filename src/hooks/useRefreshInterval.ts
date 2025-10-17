
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRefreshInterval = () => {
  const [refreshInterval, setRefreshIntervalState] = useState<string>('1min');
  const { user } = useAuth();
  const { toast } = useToast();

  // Load refresh interval from user profile
  useEffect(() => {
    const loadRefreshInterval = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('refresh_interval')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading refresh interval:', error);
          return;
        }

        if (data?.refresh_interval) {
          setRefreshIntervalState(data.refresh_interval);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadRefreshInterval();
  }, [user?.id]);

  const setRefreshInterval = async (newInterval: string) => {
    setRefreshIntervalState(newInterval);

    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ refresh_interval: newInterval })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating refresh interval:', error);
          toast({
            title: "Failed to save refresh interval",
            description: "Setting applied locally but couldn't save to profile.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Refresh interval updated",
            description: `Data will refresh every ${newInterval}`,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return { refreshInterval, setRefreshInterval };
};
