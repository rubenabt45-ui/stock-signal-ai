
import { useState, useEffect, useRef, useCallback } from 'react';

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
  const isConnectingRef = useRef(false);

  // Move connect function inside useEffect to fix React hook error
  useEffect(() => {
    const connect = () => {
      if (isConnectingRef.current || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) {
        console.log('⏭️ Connection already in progress or open, skipping');
        return;
      }

      try {
        isConnectingRef.current = true;
        console.log('🔄 Starting WebSocket connection process...');
        
        const wsUrl = `wss://xnrvqfclyroagzknedhs.supabase.co/functions/v1/finnhub-websocket`;
        console.log('🌐 Connecting to Supabase Edge Function:', wsUrl);
        
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log('✅ Connected to Supabase Edge Function WebSocket');
          setIsConnected(true);
          setError(null);
          isConnectingRef.current = false;
          
          if (subscribedSymbolsRef.current.length > 0) {
            console.log('📡 Re-subscribing to symbols on reconnect:', subscribedSymbolsRef.current);
            const subscribeMessage = {
              type: 'subscribe',
              symbols: subscribedSymbolsRef.current
            };
            console.log('📤 Sending subscription message:', JSON.stringify(subscribeMessage));
            wsRef.current?.send(JSON.stringify(subscribeMessage));
          }
        };

        wsRef.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('📨 Received message from Edge Function:', message);
            
            if (message.type === 'price_update') {
              console.log('💰 Processing price update for', message.symbol, ':', message.data);
              setPrices(prev => ({
                ...prev,
                [message.symbol]: message.data
              }));
            } else if (message.type === 'error') {
              console.error('❌ Error from Edge Function:', message.error);
              setError(`Server error: ${message.error}`);
            } else if (message.type === 'debug') {
              console.log('🔍 Debug info from Edge Function:', message.message);
            }
          } catch (err) {
            console.error('❌ Error parsing message from Edge Function:', err, 'Raw data:', event.data);
          }
        };

        wsRef.current.onclose = (event) => {
          console.log('🔌 WebSocket connection closed. Code:', event.code, 'Reason:', event.reason, 'Clean:', event.wasClean);
          setIsConnected(false);
          isConnectingRef.current = false;
          
          if (event.code !== 1000) { // Not a normal closure
            console.log('🔄 Scheduling reconnection in 5 seconds...');
            setError('Connection lost, reconnecting...');
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('🔄 Attempting to reconnect...');
              connect();
            }, 5000);
          }
        };

        wsRef.current.onerror = (err) => {
          console.error('❌ WebSocket error occurred:', err);
          setError('Failed to connect to real-time data stream');
          setIsConnected(false);
          isConnectingRef.current = false;
        };
      } catch (err) {
        console.error('❌ Failed to create WebSocket connection:', err);
        setError('Failed to initialize WebSocket connection');
        isConnectingRef.current = false;
      }
    };

    console.log('🚀 Initializing useRealTimePrices hook');
    connect();

    return () => {
      console.log('🧹 Cleaning up useRealTimePrices hook');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
      isConnectingRef.current = false;
    };
  }, []); // Empty dependency array

  const subscribe = useCallback((symbols: string[]) => {
    console.log('📡 Subscribe request for symbols:', symbols);
    subscribedSymbolsRef.current = symbols;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'subscribe',
        symbols
      };
      console.log('📤 Sending subscription message to Edge Function:', JSON.stringify(message));
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.log('⏳ WebSocket not ready for subscription, will subscribe when connected');
    }
  }, []);

  const unsubscribe = useCallback(() => {
    console.log('🛑 Unsubscribing from all symbols');
    subscribedSymbolsRef.current = [];
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    isConnectingRef.current = false;
  }, []);

  return {
    prices,
    isConnected,
    subscribe,
    unsubscribe,
    error
  };
};
