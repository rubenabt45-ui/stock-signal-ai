
import { FMP_API_KEY, FMP_BASE_URL } from '@/config/env';

export interface EconomicEvent {
  title: string;
  datetime: string;
  region: string;
  impact: "High" | "Medium" | "Low";
  date?: string;
  time?: string;
  country?: string;
  event?: string;
}

interface FMPEconomicEvent {
  date: string;
  time: string;
  country: string;
  event: string;
  currency: string;
  previous: string;
  estimate: string;
  actual: string;
  change: string;
  changePercentage: string;
  impact: string;
}

const CACHE_KEY = 'economic_events_cache';
const LAST_FETCH_KEY = 'economic_events_last_fetch';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class EconomicEventsService {
  private formatEvent(fmpEvent: FMPEconomicEvent): EconomicEvent {
    return {
      title: fmpEvent.event || 'Economic Event',
      datetime: `${fmpEvent.date}T${fmpEvent.time || '00:00:00'}Z`,
      region: fmpEvent.country || 'Unknown',
      impact: this.mapImpact(fmpEvent.impact),
      date: fmpEvent.date,
      time: fmpEvent.time,
      country: fmpEvent.country,
      event: fmpEvent.event
    };
  }

  private mapImpact(impact: string): "High" | "Medium" | "Low" {
    const impactLower = impact?.toLowerCase() || '';
    if (impactLower.includes('high') || impactLower === '3') return 'High';
    if (impactLower.includes('medium') || impactLower === '2') return 'Medium';
    return 'Low';
  }

  private filterEvents(events: EconomicEvent[]): EconomicEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter(event => {
        // Only show High impact events
        if (event.impact !== 'High') return false;
        
        // Only show events from today onwards
        const eventDate = new Date(event.datetime);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  }

  private getCachedData(): { events: EconomicEvent[]; lastFetch: number } | null {
    try {
      const cachedEvents = localStorage.getItem(CACHE_KEY);
      const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
      
      if (cachedEvents && lastFetch) {
        return {
          events: JSON.parse(cachedEvents),
          lastFetch: parseInt(lastFetch)
        };
      }
    } catch (error) {
      console.error('Error reading cached data:', error);
    }
    return null;
  }

  private setCachedData(events: EconomicEvent[]): void {
    try {
      const now = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify(events));
      localStorage.setItem(LAST_FETCH_KEY, now.toString());
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  public shouldFetchNewData(): boolean {
    const cached = this.getCachedData();
    if (!cached) return true;
    
    const now = Date.now();
    return (now - cached.lastFetch) > CACHE_DURATION;
  }

  public getLastUpdateTime(): Date | null {
    const cached = this.getCachedData();
    return cached ? new Date(cached.lastFetch) : null;
  }

  public async fetchEconomicEvents(forceRefresh = false): Promise<{
    events: EconomicEvent[];
    fromCache: boolean;
    lastUpdate: Date | null;
    error?: string;
  }> {
    // Check if we should use cached data
    if (!forceRefresh && !this.shouldFetchNewData()) {
      const cached = this.getCachedData();
      if (cached) {
        return {
          events: this.filterEvents(cached.events),
          fromCache: true,
          lastUpdate: new Date(cached.lastFetch)
        };
      }
    }

    // Fetch new data from API
    try {
      if (!FMP_API_KEY || FMP_API_KEY === 'YOUR_FMP_API_KEY_HERE') {
        throw new Error('API key not configured');
      }

      const response = await fetch(`${FMP_BASE_URL}/economic_calendar?apikey=${FMP_API_KEY}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const fmpEvents: FMPEconomicEvent[] = await response.json();
      const formattedEvents = fmpEvents.map(event => this.formatEvent(event));
      
      // Cache the new data
      this.setCachedData(formattedEvents);
      
      return {
        events: this.filterEvents(formattedEvents),
        fromCache: false,
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Error fetching economic events:', error);
      
      // Try to return cached data if available
      const cached = this.getCachedData();
      if (cached) {
        return {
          events: this.filterEvents(cached.events),
          fromCache: true,
          lastUpdate: new Date(cached.lastFetch),
          error: error instanceof Error ? error.message : 'Failed to fetch new data'
        };
      }
      
      // If no cached data available, return error
      return {
        events: [],
        fromCache: false,
        lastUpdate: null,
        error: error instanceof Error ? error.message : 'Failed to fetch economic events'
      };
    }
  }
}

export const economicEventsService = new EconomicEventsService();
