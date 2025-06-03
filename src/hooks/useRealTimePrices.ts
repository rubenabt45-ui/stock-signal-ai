
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
  const subscribedSymbolsRef = useRef<string[]>([]);

  const connect = () => {
    try {
      // Use the correct Supabase edge function URL for WebSocket
      const wsUrl = `wss://xnrvqfclyroagzknedhs.supabase.co/functions/v1/finnhub-websocket`;
      console.log('Attempting to connect to:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ Connected to Finnhub real-time price stream');
        setIsConnected(true);
        setError(null);
        
        // Re-subscribe to any previously subscribed symbols
        if (subscribedSymbolsRef.current.length > 0) {
          console.log('Re-subscribing to symbols:', subscribedSymbolsRef.current);
          wsRef.current?.send(JSON.stringify({
            type: 'subscribe',
            symbols: subscribedSymbolsRef.current
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📊 Received WebSocket message:', message);
          
          if (message.type === 'price_update') {
            console.log('💰 Real-time price update for', message.symbol, ':', message.data);
            setPrices(prev => ({
              ...prev,
              [message.symbol]: message.data
            }));
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 Disconnected from price stream. Code:', event.code, 'Reason:', event.reason);
        setIsConnected(false);
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (err) => {
        console.error('❌ WebSocket error:', err);
        setError('Failed to connect to real-time data stream');
        setIsConnected(false);
      };
    } catch (err) {
      setError('Failed to initialize WebSocket connection');
      console.error('❌ WebSocket connection error:', err);
    }
  };

  const subscribe = (symbols: string[]) => {
    console.log('📡 Subscribing to symbols:', symbols);
    subscribedSymbolsRef.current = symbols;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'subscribe',
        symbols
      };
      console.log('📤 Sending subscription message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.log('⏳ WebSocket not ready, will subscribe when connected');
    }
  };

  const unsubscribe = () => {
    console.log('🛑 Unsubscribing from all symbols');
    subscribedSymbolsRef.current = [];
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
