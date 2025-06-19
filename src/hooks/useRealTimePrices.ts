
import { useState, useEffect, useRef, useCallback } from 'react';

interface PriceData {
  currentPrice: number;
  change: number;
  timestamp: number;
}

interface RealTimePricesReturn {
  prices: Record<string, PriceData>;
  isConnected: boolean;
  error: string | null;
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
  reconnect: () => void;
}

export const useRealTimePrices = (): RealTimePricesReturn => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 15;
  const subscribedSymbolsRef = useRef<Set<string>>(new Set());

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket already connected');
      return;
    }

    try {
      console.log(`🔄 Connecting to Edge Function (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
      
      const wsUrl = 'wss://xnrvqfclyroagzknedhs.supabase.co/functions/v1/websocket-prices';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Resubscribe to symbols
        if (subscribedSymbolsRef.current.size > 0) {
          const symbols = Array.from(subscribedSymbolsRef.current);
          console.log('🔄 Resubscribing to symbols:', symbols);
          wsRef.current?.send(JSON.stringify({ action: 'subscribe', symbols }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.symbol && data.price) {
            setPrices(prev => ({
              ...prev,
              [data.symbol]: {
                currentPrice: data.price,
                change: data.change || 0,
                timestamp: Date.now()
              }
            }));
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error occurred:', error);
        setError('Connection error occurred');
      };

      wsRef.current.onclose = (event) => {
        console.log(`🔌 WebSocket connection closed: ${event.code} ${event.reason}`);
        setIsConnected(false);
        
        if (event.code === 1006) {
          console.log('🔌 Abnormal closure detected (likely network issue)');
        }
        
        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`🔄 Scheduling reconnection in ${backoffDelay}ms... (${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, backoffDelay);
        } else {
          console.error('❌ Maximum reconnection attempts reached');
          setError('Maximum reconnection attempts reached. Please refresh the page.');
        }
      };
    } catch (err) {
      console.error('❌ Failed to create WebSocket connection:', err);
      setError('Failed to establish connection');
    }
  }, []);

  const subscribe = useCallback((symbols: string[]) => {
    symbols.forEach(symbol => subscribedSymbolsRef.current.add(symbol));
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('📡 Subscribing to symbols:', symbols);
      wsRef.current.send(JSON.stringify({ action: 'subscribe', symbols }));
    } else {
      console.log('📡 WebSocket not ready, will subscribe after connection');
      connect();
    }
  }, [connect]);

  const unsubscribe = useCallback((symbols: string[]) => {
    symbols.forEach(symbol => subscribedSymbolsRef.current.delete(symbol));
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('📡 Unsubscribing from symbols:', symbols);
      wsRef.current.send(JSON.stringify({ action: 'unsubscribe', symbols }));
    }
  }, []);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnection triggered');
    reconnectAttemptsRef.current = 0;
    if (wsRef.current) {
      wsRef.current.close();
    }
    connect();
  }, [connect]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    prices,
    isConnected,
    error,
    subscribe,
    unsubscribe,
    reconnect
  };
};
