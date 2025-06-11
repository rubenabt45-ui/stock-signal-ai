
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserAlert {
  id: string;
  user_id: string;
  symbol: string;
  alert_type: 'price' | 'percentage' | 'pattern';
  threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserAlerts = () => {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAlerts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        setError(error.message);
      } else {
        // Type assertion to ensure proper typing
        setAlerts((data || []) as UserAlert[]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async (alertData: Omit<UserAlert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .insert({
          user_id: user.id,
          ...alertData
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding alert:', error);
        toast({
          title: "Error",
          description: "Failed to create alert",
          variant: "destructive",
        });
        return false;
      }

      // Type assertion for the new alert
      setAlerts(prev => [data as UserAlert, ...prev]);
      toast({
        title: "Alert Created",
        description: `Alert for ${alertData.symbol} has been created`,
      });
      return true;
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAlert = async (id: string, updates: Partial<UserAlert>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating alert:', error);
        toast({
          title: "Error",
          description: "Failed to update alert",
          variant: "destructive",
        });
        return false;
      }

      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, ...(data as UserAlert) } : alert
      ));
      
      toast({
        title: "Alert Updated",
        description: "Alert has been updated successfully",
      });
      return true;
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAlert = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting alert:', error);
        toast({
          title: "Error",
          description: "Failed to delete alert",
          variant: "destructive",
        });
        return false;
      }

      setAlerts(prev => prev.filter(alert => alert.id !== id));
      toast({
        title: "Alert Deleted",
        description: "Alert has been removed",
      });
      return true;
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  return {
    alerts,
    loading,
    error,
    addAlert,
    updateAlert,
    deleteAlert,
    refetch: fetchAlerts
  };
};
