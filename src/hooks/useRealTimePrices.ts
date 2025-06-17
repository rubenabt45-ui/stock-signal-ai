import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  const maxReconnectAttempts = 15; // Increased attempts
  const isUnmountedRef = useRef(false);
  const lastSuccessfulConnectionRef = useRef<number>(0);
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  // Exponential backoff calculation
  const getReconnectDelay = useCallback((attempt: number) => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 60000; // 1 minute max
    const exponentialDelay = baseDelay * Math.pow(2, Math.min(attempt - 1, 6)); // Cap at 2^6
    return Math.min(exponentialDelay + Math.random() * 1000, maxDelay); // Add jitter
  }, []);

  const connect = useCallback(() => {
    if (isUnmountedRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Reset reconnect attempts if it's been more than 5 minutes since last successful connection
    const now = Date.now();
    if (now - lastSuccessfulConnectionRef.current > 300000) {
      console.log('🔄 Resetting reconnect attempts due to time gap (5+ minutes)');
      reconnectAttemptsRef.current = 0;
      setError(null);
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      const finalError = 'Maximum reconnection attempts reached. Please refresh the page to restore connection.';
      console.error('❌ ' + finalError);
      setError(finalError);
      return;
    }

    try {
      reconnectAttemptsRef.current++;
      console.log(`🔄 Connecting to Edge Function (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
      
      const wsUrl = `wss://xnrvqfclyroagzknedhs.supabase.co/functions/v1/finnhub-websocket`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        if (isUnmountedRef.current) {
          wsRef.current?.close();
          return;
        }

        console.log('✅ Successfully connected to Edge Function');
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

        // Set up keep-alive ping
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          } else {
            clearInterval(pingIntervalRef.current!);
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
            
            // Handle different types of server errors
            if (message.error.includes('token') || message.error.includes('401') || message.error.includes('403')) {
              setError('Authentication error with market data provider. Please refresh and try again.');
              reconnectAttemptsRef.current = maxReconnectAttempts; // Stop retrying for auth errors
            } else if (message.error.includes('rate limit')) {
              setError('Rate limit reached. Retrying with reduced frequency...');
            } else {
              setError(`Server error: ${message.error}`);
            }
          } else if (message.type === 'debug') {
            console.log('🔍 Debug:', message.message);
            
            if (message.message.includes('Subscribed to')) {
              console.log('✅ Subscription confirmed by market data provider');
            }
          } else if (message.type === 'pong') {
            console.log('🏓 Received pong from server - connection healthy');
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = undefined;
        }
        
        if (isUnmountedRef.current) return;
        
        // Handle different close codes
        if (event.code === 1000) {
          console.log('👋 Normal connection closure - not reconnecting');
          return;
        }
        
        if (event.code === 1006) {
          console.log('🔌 Abnormal closure detected (likely network issue)');
        }
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = getReconnectDelay(reconnectAttemptsRef.current);
          console.log(`🔄 Scheduling reconnection in ${delay}ms... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          setError(`Connection lost, reconnecting in ${Math.round(delay/1000)}s... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              connect();
            }
          }, delay);
        } else {
          const finalError = 'Maximum reconnection attempts reached. Please refresh the page to restore connection.';
          console.error('❌ ' + finalError);
          setError(finalError);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error occurred:', error);
        setError('Connection failed - attempting to reconnect...');
        setIsConnected(false);
      };
    } catch (err) {
      console.error('❌ Failed to create WebSocket connection:', err);
      setError('Failed to initialize connection - retrying...');
    }
  }, [getReconnectDelay]);

  useEffect(() => {
    console.log('🚀 Initializing real-time prices hook with enhanced connection management');
    isUnmountedRef.current = false;
    connect();

    return () => {
      console.log('🧹 Cleaning up real-time prices hook');
      isUnmountedRef.current = true;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
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
      // Force reconnection if not connected and not at max attempts
      if (!isConnected && reconnectAttemptsRef.current < maxReconnectAttempts) {
        console.log('🔄 Forcing reconnection due to subscription request');
        connect();
      }
    }
  }, [connect, isConnected]);

  const unsubscribe = useCallback(() => {
    console.log('🛑 Unsubscribing from all symbols');
    subscribedSymbolsRef.current = [];
    isUnmountedRef.current = true;
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
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
