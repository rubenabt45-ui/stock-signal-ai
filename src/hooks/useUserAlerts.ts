import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useToast } from '@/hooks/use-toast';

export interface UserAlert {
  id: string;
  symbol: string;
  alert_type: 'price' | 'percentage' | 'pattern';
  threshold: number;
  is_active: boolean;
  created_at: string;
  triggered_at?: string;
}

interface AddAlertInput {
  symbol: string;
  alert_type: 'price' | 'percentage' | 'pattern';
  threshold: number;
}

interface UpdateAlertInput {
  threshold?: number;
  alert_type?: 'price' | 'percentage' | 'pattern';
  is_active?: boolean;
}

export const useUserAlerts = () => {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load alerts on mount and when user changes
  useEffect(() => {
    if (user) {
      loadAlerts();
    } else {
      setAlerts([]);
      setLoading(false);
    }
  }, [user]);

  const loadAlerts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading alerts:', error);
        toast({
          title: "Error loading alerts",
          description: "Unable to load your alerts. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async ({ symbol, alert_type, threshold }: AddAlertInput) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create alerts.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .insert({
          user_id: user.id,
          symbol,
          alert_type,
          threshold,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding alert:', error);
        toast({
          title: "Error creating alert",
          description: "Unable to create alert. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setAlerts(prev => [data, ...prev]);
      toast({
        title: "Alert created",
        description: `Alert for ${symbol} has been created successfully.`,
      });
      return true;
    } catch (error) {
      console.error('Error adding alert:', error);
      toast({
        title: "Error creating alert",
        description: "Unable to create alert. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAlert = async (alertId: string, updates: UpdateAlertInput) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .update(updates)
        .eq('id', alertId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating alert:', error);
        toast({
          title: "Error updating alert",
          description: "Unable to update alert. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? data : alert
      ));

      toast({
        title: "Alert updated",
        description: "Alert has been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error updating alert",
        description: "Unable to update alert. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting alert:', error);
        toast({
          title: "Error deleting alert",
          description: "Unable to delete alert. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast({
        title: "Alert deleted",
        description: "Alert has been deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error deleting alert",
        description: "Unable to delete alert. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    alerts,
    loading,
    addAlert,
    updateAlert,
    deleteAlert,
    refreshAlerts: loadAlerts
  };
};
