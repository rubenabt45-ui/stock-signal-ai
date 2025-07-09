import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

export const useDailyMessages = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canSendMessage, setCanSendMessage] = useState(true);

  const MAX_FREE_MESSAGES = 5;

  const fetchMessageCount = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('daily_message_count, daily_message_reset')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const today = new Date().toDateString();
      const resetDate = data.daily_message_reset ? new Date(data.daily_message_reset).toDateString() : null;

      // Reset count if it's a new day
      if (resetDate !== today) {
        await supabase
          .from('user_profiles')
          .update({
            daily_message_count: 0,
            daily_message_reset: new Date().toISOString().split('T')[0]
          })
          .eq('id', user.id);
        
        setMessageCount(0);
      } else {
        setMessageCount(data.daily_message_count || 0);
      }
    } catch (error) {
      console.error('Error fetching message count:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementMessageCount = async () => {
    if (!user || isPro) return true;

    try {
      const newCount = messageCount + 1;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          daily_message_count: newCount,
          daily_message_reset: new Date().toISOString().split('T')[0]
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessageCount(newCount);
      return true;
    } catch (error) {
      console.error('Error incrementing message count:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMessageCount();
  }, [user]);

  useEffect(() => {
    if (isPro) {
      setCanSendMessage(true);
    } else {
      setCanSendMessage(messageCount < MAX_FREE_MESSAGES);
    }
  }, [messageCount, isPro]);

  return {
    messageCount,
    maxMessages: MAX_FREE_MESSAGES,
    canSendMessage,
    remainingMessages: Math.max(0, MAX_FREE_MESSAGES - messageCount),
    incrementMessageCount,
    loading,
    isPro
  };
};