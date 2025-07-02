
import { useState, useEffect } from 'react';
import { economicEventsService, EconomicEvent } from '@/services/economicEventsService';

interface UseEconomicEventsResult {
  events: EconomicEvent[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  fromCache: boolean;
  refreshEvents: () => Promise<void>;
}

export const useEconomicEvents = (): UseEconomicEventsResult => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const loadEvents = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await economicEventsService.fetchEconomicEvents(forceRefresh);
      
      setEvents(result.events);
      setLastUpdate(result.lastUpdate);
      setFromCache(result.fromCache);
      
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error in useEconomicEvents:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    await loadEvents(true);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return {
    events,
    loading,
    error,
    lastUpdate,
    fromCache,
    refreshEvents
  };
};
