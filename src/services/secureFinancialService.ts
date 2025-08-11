
import { supabase } from '@/integrations/supabase/client';

export class SecureFinancialService {
  private static async makeSecureRequest(endpoint: string, symbol?: string, additionalParams?: Record<string, string>) {
    const params = new URLSearchParams({
      endpoint,
      ...(symbol && { symbol }),
      ...(additionalParams || {})
    });

    try {
      const { data, error } = await supabase.functions.invoke('financial-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: params.toString() })
      });

      if (error) {
        console.error('Secure financial service error:', error);
        throw new Error(`Financial data request failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Secure financial service error:', error);
      throw error;
    }
  }

  static async getStockPrice(symbol: string) {
    return this.makeSecureRequest('quote-short', symbol);
  }

  static async getCompanyProfile(symbol: string) {
    return this.makeSecureRequest('profile', symbol);
  }

  static async getHistoricalData(symbol: string, period: string = '1day') {
    return this.makeSecureRequest('historical-chart', symbol, { period });
  }

  static async getMarketData() {
    return this.makeSecureRequest('market-performance');
  }

  static async getEconomicCalendar() {
    return this.makeSecureRequest('economic_calendar');
  }
}
