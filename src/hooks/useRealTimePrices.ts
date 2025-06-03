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
  const keepAliveIntervalRef = useRef<NodeJS.Timeout>();
  const subscribedSymbolsRef = useRef<string[]>([]);
  const isConnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;
  const baseReconnectDelay = 1000; // 1 second
  const isUnmountedRef = useRef(false);

  // Calculate exponential backoff delay
  const getReconnectDelay = useCallback(() => {
    const delay = Math.min(baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current), 30000); // Max 30 seconds
    console.log(`🕐 Reconnect attempt ${reconnectAttemptsRef.current + 1}, delay: ${delay}ms`);
    return delay;
  }, []);

  // Send keep-alive ping to prevent timeouts
  const sendKeepAlive = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !isUnmountedRef.current) {
      console.log('💓 Sending keep-alive ping to Edge Function');
      try {
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      } catch (err) {
        console.error('❌ Failed to send keep-alive ping:', err);
      }
    }
  }, []);

  // Start keep-alive interval
  const startKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
    }
    if (!isUnmountedRef.current) {
      console.log('💓 Starting keep-alive interval (15 seconds)');
      keepAliveIntervalRef.current = setInterval(sendKeepAlive, 15000); // 15 seconds
    }
  }, [sendKeepAlive]);

  // Stop keep-alive interval
  const stopKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      console.log('🛑 Stopping keep-alive interval');
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = undefined;
    }
  }, []);

  // Connection function with exponential backoff and enhanced error handling
  const connect = useCallback(() => {
    if (isUnmountedRef.current) {
      console.log('🛑 Component unmounted, skipping connection');
      return;
    }

    if (isConnectingRef.current || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) {
      console.log('⏭️ Connection already in progress or open, skipping');
      return;
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached, giving up');
      setError('Maximum reconnection attempts reached. Please refresh the page.');
      return;
    }

    try {
      isConnectingRef.current = true;
      console.log(`🔄 Starting WebSocket connection (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
      
      const wsUrl = `wss://xnrvqfclyroagzknedhs.supabase.co/functions/v1/finnhub-websocket`;
      console.log('🌐 Connecting to Supabase Edge Function:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        if (isUnmountedRef.current) {
          console.log('🛑 Component unmounted after connection, closing');
          wsRef.current?.close();
          return;
        }

        console.log('✅ Connected to Supabase Edge Function WebSocket');
        setIsConnected(true);
        setError(null);
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0; // Reset attempts on successful connection
        
        // Start keep-alive
        startKeepAlive();
        
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
        if (isUnmountedRef.current) return;

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
          } else if (message.type === 'pong') {
            console.log('🏓 Received pong from Edge Function');
          }
        } catch (err) {
          console.error('❌ Error parsing message from Edge Function:', err, 'Raw data:', event.data);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket connection closed. Code:', event.code, 'Reason:', event.reason, 'Clean:', event.wasClean);
        setIsConnected(false);
        isConnectingRef.current = false;
        stopKeepAlive();
        
        if (isUnmountedRef.current) {
          console.log('🛑 Component unmounted, not reconnecting');
          return;
        }
        
        // Enhanced error code handling
        if (event.code === 1000) {
          console.log('✅ Normal closure, not reconnecting');
          return;
        }

        if (event.code === 1006) {
          console.log('⚠️ Abnormal closure detected, will attempt reconnection');
          setError('Connection lost unexpectedly, reconnecting...');
        } else if (event.code === 1011) {
          console.error('❌ Server error, will attempt reconnection');
          setError('Server error detected, reconnecting...');
        } else if (event.code === 4001) {
          console.error('❌ Authentication failure, not reconnecting');
          setError('Authentication failed. Please check your configuration.');
          return;
        }
        
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = getReconnectDelay();
          console.log(`🔄 Scheduling reconnection in ${delay}ms...`);
          setError(`Connection lost, reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              console.log('🔄 Attempting to reconnect...');
              connect();
            }
          }, delay);
        } else {
          console.error('❌ Max reconnection attempts reached');
          setError('Connection failed after multiple attempts. Please refresh the page.');
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('❌ WebSocket error occurred:', err);
        setError('Failed to connect to real-time data stream');
        setIsConnected(false);
        isConnectingRef.current = false;
        stopKeepAlive();
      };
    } catch (err) {
      console.error('❌ Failed to create WebSocket connection:', err);
      setError('Failed to initialize WebSocket connection');
      isConnectingRef.current = false;
    }
  }, [startKeepAlive, stopKeepAlive, getReconnectDelay]);

  // Initialize connection only once
  useEffect(() => {
    console.log('🚀 Initializing useRealTimePrices hook (mount only)');
    isUnmountedRef.current = false;
    connect();

    return () => {
      console.log('🧹 Cleaning up useRealTimePrices hook');
      isUnmountedRef.current = true;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      stopKeepAlive();
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
      isConnectingRef.current = false;
      reconnectAttemptsRef.current = 0;
    };
  }, [connect, stopKeepAlive]); // Added dependencies to fix hook order

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
    isUnmountedRef.current = true;
    stopKeepAlive();
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
  }, [stopKeepAlive]);

  return {
    prices,
    isConnected,
    subscribe,
    unsubscribe,
    error
  };
};
