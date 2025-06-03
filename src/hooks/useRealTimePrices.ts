
import { useState, useEffect, useRef } from 'react';

interface PriceData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface UseRealTimePricesReturn {
  prices: Record<string, PriceData>;
  isConnected: boolean;
  subscribe: (symbols: string[]) => void;
  unsubscribe: () => void;
  error: string | null;
}

export const useRealTimePrices = (): UseRealTimePricesReturn => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      // Connect to our Supabase edge function that handles Finnhub WebSocket
      const wsUrl = `wss://xnrvqfclyroagzknedhs.supabase.co/functions/v1/finnhub-websocket`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to Finnhub real-time price stream');
        setIsConnected(true);
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'price_update') {
            console.log('Received real-time price update:', message);
            setPrices(prev => ({
              ...prev,
              [message.symbol]: message.data
            }));
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from price stream');
        setIsConnected(false);
        
        // Auto-reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
      };
    } catch (err) {
      setError('Failed to connect to price stream');
      console.error('WebSocket connection error:', err);
    }
  };

  const subscribe = (symbols: string[]) => {
    console.log('Subscribing to symbols:', symbols);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        symbols
      }));
    }
  };

  const unsubscribe = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    prices,
    isConnected,
    subscribe,
    unsubscribe,
    error
  };
};
