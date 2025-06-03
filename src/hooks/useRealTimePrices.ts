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
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10; // Increased from 5
  const isUnmountedRef = useRef(false);
  const lastSuccessfulConnectionRef = useRef<number>(0);

  const connect = useCallback(() => {
    if (isUnmountedRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Reset reconnect attempts if it's been more than 2 minutes since last successful connection
    const now = Date.now();
    if (now - lastSuccessfulConnectionRef.current > 120000) {
      console.log('🔄 Resetting reconnect attempts due to time gap');
      reconnectAttemptsRef.current = 0;
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setError('Maximum reconnection attempts reached. Please refresh the page.');
      return;
    }

    try {
      console.log(`🔄 Connecting to Edge Function (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
      
      const wsUrl = `wss://xnrvqfclyroagzknedhs.supabase.co/functions/v1/finnhub-websocket`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        if (isUnmountedRef.current) {
          wsRef.current?.close();
          return;
        }

        console.log('✅ Connected to Edge Function');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0; // Reset on successful connection
        lastSuccessfulConnectionRef.current = Date.now();
        
        // Subscribe to symbols immediately after connection
        if (subscribedSymbolsRef.current.length > 0) {
          console.log('📡 Re-subscribing to symbols after reconnection:', subscribedSymbolsRef.current);
          wsRef.current?.send(JSON.stringify({
            type: 'subscribe',
            symbols: subscribedSymbolsRef.current
          }));
        }

        // Send a ping to keep connection alive
        const pingInterval = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000); // Ping every 30 seconds
      };

      wsRef.current.onmessage = (event) => {
        if (isUnmountedRef.current) return;

        try {
          const message = JSON.parse(event.data);
          console.log('📨 Received from Edge Function:', message);
          
          if (message.type === 'price_update') {
            console.log('💰 Price update:', message.symbol, message.data);
            setPrices(prev => ({
              ...prev,
              [message.symbol]: message.data
            }));
          } else if (message.type === 'error') {
            console.error('❌ Server error:', message.error);
            setError(`Server error: ${message.error}`);
            
            // If it's a token error, don't retry immediately
            if (message.error.includes('token') || message.error.includes('401') || message.error.includes('403')) {
              setError('Authentication error with Finnhub. Please check API key.');
              reconnectAttemptsRef.current = maxReconnectAttempts; // Stop retrying
            }
          } else if (message.type === 'debug') {
            console.log('🔍 Debug:', message.message);
            
            // Look for subscription confirmations
            if (message.message.includes('Subscribed to')) {
              console.log('✅ Subscription confirmed by Finnhub');
            }
          } else if (message.type === 'pong') {
            console.log('🏓 Received pong from server');
          }
        } catch (err) {
          console.error('❌ Error parsing message:', err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 Connection closed:', event.code, event.reason);
        setIsConnected(false);
        
        if (isUnmountedRef.current) return;
        
        // Different handling based on close code
        if (event.code === 1000) {
          // Normal closure, don't reconnect
          console.log('👋 Normal connection closure');
          return;
        }
        
        if (event.code === 1006) {
          // Abnormal closure, likely network issue
          console.log('🔌 Abnormal closure detected (network issue)');
        }
        
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000); // Cap at 30s
          console.log(`🔄 Reconnecting in ${delay}ms... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          setError(`Connection lost, reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              connect();
            }
          }, delay);
        } else {
          setError('Maximum reconnection attempts reached. Please refresh the page.');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setError('Connection failed');
        setIsConnected(false);
      };
    } catch (err) {
      console.error('❌ Failed to create WebSocket:', err);
      setError('Failed to initialize connection');
    }
  }, []);

  useEffect(() => {
    console.log('🚀 Initializing real-time prices hook');
    isUnmountedRef.current = false;
    connect();

    return () => {
      console.log('🧹 Cleaning up real-time prices hook');
      isUnmountedRef.current = true;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  const subscribe = useCallback((symbols: string[]) => {
    console.log('📡 Subscribe request:', symbols);
    subscribedSymbolsRef.current = symbols;
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending subscription to Edge Function');
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        symbols
      }));
    } else {
      console.log('⏳ WebSocket not ready, will subscribe when connected');
      // Force reconnection if not connected
      if (!isConnected && reconnectAttemptsRef.current < maxReconnectAttempts) {
        console.log('🔄 Forcing reconnection due to subscription request');
        connect();
      }
    }
  }, [connect, isConnected]);

  const unsubscribe = useCallback(() => {
    console.log('🛑 Unsubscribing');
    subscribedSymbolsRef.current = [];
    isUnmountedRef.current = true;
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  return {
    prices,
    isConnected,
    subscribe,
    unsubscribe,
    error
  };
};
