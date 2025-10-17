
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
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading refresh interval:', error);
          return;
        }

        if (data?.refresh_interval) {
          // Convert number to string format (30 -> "30sec", 60 -> "1min", etc.)
          const seconds = data.refresh_interval;
          const intervalString = seconds >= 60 ? `${seconds / 60}min` : `${seconds}sec`;
          setRefreshIntervalState(intervalString);
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
        // Convert string format to seconds (e.g., "1min" -> 60, "30sec" -> 30)
        const seconds = newInterval.includes('min') 
          ? parseInt(newInterval) * 60 
          : parseInt(newInterval);

        const { error } = await supabase
          .from('user_profiles')
          .update({ refresh_interval: seconds })
          .eq('user_id', user.id);

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
