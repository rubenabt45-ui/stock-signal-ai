import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Edge function started - initializing...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Enhanced API key validation
    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY')
    console.log('🔑 Environment check - Finnhub API key exists:', !!finnhubApiKey)
    
    if (!finnhubApiKey) {
      console.error('❌ CRITICAL: FINNHUB_API_KEY not found in environment')
      throw new Error('Finnhub API key not configured in Supabase Vault')
    }
    
    console.log('🔑 Finnhub API key preview:', finnhubApiKey.substring(0, 8) + '...')
    console.log('🔑 Finnhub API key length:', finnhubApiKey.length)
    
    // Validate API key format (should be alphanumeric)
    if (!/^[a-zA-Z0-9]+$/.test(finnhubApiKey)) {
      console.error('❌ CRITICAL: Invalid API key format detected');
      throw new Error('Invalid Finnhub API key format');
    }

    // Test API key with HTTP request first
    console.log('🧪 Testing API key with HTTP request...');
    try {
      const testUrl = `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${finnhubApiKey}`;
      const testResponse = await fetch(testUrl);
      console.log('🧪 API test response status:', testResponse.status);
      
      if (testResponse.status === 401) {
        console.error('❌ CRITICAL: API key authentication failed (401)');
        throw new Error('Invalid Finnhub API key - authentication failed');
      } else if (testResponse.status === 403) {
        console.error('❌ CRITICAL: API key lacks permissions (403)');
        throw new Error('Finnhub API key lacks required permissions');
      } else if (testResponse.status === 429) {
        console.error('⚠️ WARNING: Rate limit exceeded (429)');
      } else if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('✅ API key validation successful, sample data:', testData);
      }
    } catch (apiError) {
      console.error('❌ API key validation failed:', apiError);
      throw new Error(`API key validation failed: ${apiError.message}`);
    }

    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 })
    }

    console.log('🔌 Upgrading to WebSocket connection...');
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    let symbols: string[] = []
    let finnhubWs: WebSocket | null = null
    let priceCache: Record<string, any> = {}
    let keepAliveInterval: number | null = null
    let reconnectTimeout: number | null = null
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    let isManualClose = false

    const sendDebugMessage = (message: string) => {
      console.log('🔍 DEBUG:', message);
      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'debug',
            message: message,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (err) {
        console.error('Failed to send debug message:', err);
      }
    };

    const sendErrorMessage = (error: string) => {
      console.error('❌ ERROR:', error);
      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'error',
            error: error,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (err) {
        console.error('Failed to send error message:', err);
      }
    };

    // Enhanced keep-alive for Finnhub connection
    const startFinnhubKeepAlive = () => {
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      console.log('💓 Starting Finnhub keep-alive interval (20 seconds)');
      keepAliveInterval = setInterval(() => {
        if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) {
          console.log('💓 Sending ping to Finnhub');
          try {
            finnhubWs.send(JSON.stringify({ type: 'ping' }));
          } catch (err) {
            console.error('❌ Failed to send ping to Finnhub:', err);
          }
        } else {
          console.log('💓 Finnhub WebSocket not ready for ping');
        }
      }, 20000); // 20 seconds
    };

    const stopFinnhubKeepAlive = () => {
      if (keepAliveInterval) {
        console.log('🛑 Stopping Finnhub keep-alive interval');
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }
    };

    const subscribeToSymbols = () => {
      if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN && symbols.length > 0) {
        console.log('📡 Re-subscribing to symbols after reconnect:', symbols);
        symbols.forEach(symbol => {
          const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol});
          console.log(`📡 Sending subscription for ${symbol}:`, subscribeMsg);
          try {
            finnhubWs?.send(subscribeMsg);
            sendDebugMessage(`📡 Re-subscribed to ${symbol} after reconnect`);
          } catch (err) {
            console.error(`❌ Failed to subscribe to ${symbol}:`, err);
            sendErrorMessage(`Failed to subscribe to ${symbol}: ${err.message}`);
          }
        });
      }
    };

    const connectToFinnhub = () => {
      if (isManualClose) {
        console.log('🛑 Manual close detected, not reconnecting');
        return;
      }

      if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('❌ Max Finnhub reconnection attempts reached');
        sendErrorMessage('❌ Max Finnhub reconnection attempts reached');
        return;
      }

      const finnhubWsUrl = `wss://ws.finnhub.io?token=${finnhubApiKey}`;
      console.log('🔌 Connecting to Finnhub WebSocket...');
      console.log('🌐 Finnhub WS URL structure: wss://ws.finnhub.io?token=', finnhubApiKey?.substring(0, 8) + '...');
      
      sendDebugMessage(`Connecting to Finnhub (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
      
      try {
        finnhubWs = new WebSocket(finnhubWsUrl);
        
        finnhubWs.onopen = () => {
          console.log('✅ Successfully connected to Finnhub WebSocket!');
          sendDebugMessage('✅ Connected to Finnhub WebSocket successfully');
          reconnectAttempts = 0; // Reset on successful connection
          
          // Start keep-alive
          startFinnhubKeepAlive();
          
          // Subscribe to symbols when connection opens
          subscribeToSymbols();
        };

        finnhubWs.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 Raw message from Finnhub:', data);
            
            if (data.type === 'trade' && data.data && data.data.length > 0) {
              console.log(`📈 Processing ${data.data.length} trade(s) from Finnhub`);
              sendDebugMessage(`📈 Received ${data.data.length} trades from Finnhub`);
              
              for (const trade of data.data) {
                const symbol = trade.s;
                const price = trade.p;
                const volume = trade.v;
                const timestamp = trade.t;

                console.log(`💹 Trade received: ${symbol} @ $${price} (vol: ${volume}, time: ${timestamp})`);
                sendDebugMessage(`💹 Live trade: ${symbol} = $${price}`);

                // Get or create price cache entry
                if (!priceCache[symbol]) {
                  const initialQuote = await getInitialQuote(symbol);
                  if (initialQuote) {
                    priceCache[symbol] = initialQuote;
                  }
                }

                // Update with real-time trade price
                if (priceCache[symbol]) {
                  const cachedPrice = priceCache[symbol];
                  const change = price - cachedPrice.previousClose;
                  const changePercent = cachedPrice.previousClose ? (change / cachedPrice.previousClose) * 100 : 0;

                  const priceData = {
                    symbol,
                    currentPrice: price,
                    change,
                    changePercent,
                    high: Math.max(cachedPrice.high, price),
                    low: Math.min(cachedPrice.low, price),
                    open: cachedPrice.open,
                    previousClose: cachedPrice.previousClose,
                    timestamp: Date.now()
                  };

                  priceCache[symbol] = priceData;

                  console.log(`📤 Sending live price update to client:`, priceData);

                  // Send to client
                  if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                      type: 'price_update',
                      symbol,
                      data: priceData
                    }));
                  }

                  // Store in database
                  try {
                    await supabaseClient
                      .from('price_updates')
                      .upsert({
                        symbol,
                        current_price: price,
                        change,
                        change_percent: changePercent,
                        high: priceData.high,
                        low: priceData.low,
                        open: priceData.open,
                        previous_close: priceData.previousClose,
                        timestamp: new Date().toISOString()
                      });
                  } catch (dbError) {
                    console.error('❌ Database storage error:', dbError);
                  }
                }
              }
            } else if (data.type === 'ping') {
              console.log('🏓 Received ping from Finnhub');
              sendDebugMessage('🏓 Finnhub ping received');
            } else if (data.type === 'error') {
              console.error('❌ Error from Finnhub:', data);
              sendErrorMessage(`Finnhub error: ${JSON.stringify(data)}`);
            } else {
              console.log('📨 Other message type from Finnhub:', data.type, data);
              sendDebugMessage(`📨 Finnhub message: ${data.type}`);
            }
          } catch (error) {
            console.error('❌ Error processing Finnhub message:', error, 'Raw event:', event.data);
            sendDebugMessage(`❌ Error processing Finnhub message: ${error.message}`);
          }
        };

        finnhubWs.onclose = (event) => {
          console.log('🔌 Finnhub WebSocket closed:', event.code, event.reason, 'Clean:', event.wasClean);
          sendDebugMessage(`🔌 Finnhub connection closed: ${event.code} - ${event.reason}`);
          stopFinnhubKeepAlive();
          
          // Enhanced error code handling
          if (event.code === 1000) {
            console.log('✅ Normal closure, not reconnecting');
            return;
          } else if (event.code === 1006) {
            console.log('⚠️ Abnormal closure detected (1006)');
            sendErrorMessage('Connection lost unexpectedly (1006)');
          } else if (event.code === 1011) {
            console.error('❌ Server error (1011)');
            sendErrorMessage('Server encountered an error (1011)');
          } else if (event.code === 4001) {
            console.error('❌ Invalid API key (4001)');
            sendErrorMessage('Invalid API key - check configuration');
            return; // Don't reconnect on auth failure
          }
          
          // Reconnect with exponential backoff if not a permanent failure
          if (!isManualClose && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 30000); // Exponential backoff, max 30s
            console.log(`🔄 Scheduling Finnhub reconnection in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            sendDebugMessage(`🔄 Reconnecting to Finnhub in ${delay}ms...`);
            
            reconnectTimeout = setTimeout(() => {
              console.log('🔄 Reconnecting to Finnhub...');
              connectToFinnhub();
            }, delay);
          } else {
            console.error('❌ Finnhub connection failed permanently');
            sendErrorMessage('❌ Finnhub connection failed permanently');
          }
        };

        finnhubWs.onerror = (error) => {
          console.error('❌ Finnhub WebSocket error:', error);
          sendErrorMessage(`❌ Finnhub WebSocket error: ${error}`);
          stopFinnhubKeepAlive();
        };
      } catch (err) {
        console.error('❌ Failed to create Finnhub WebSocket:', err);
        sendErrorMessage(`Failed to create WebSocket: ${err.message}`);
      }
    };

    const getInitialQuote = async (symbol: string) => {
      try {
        console.log(`📊 Fetching initial quote for ${symbol} from Finnhub REST API...`);
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
        
        const response = await fetch(quoteUrl);
        console.log(`📈 Quote API response status for ${symbol}:`, response.status);
        
        if (response.status === 401) {
          console.error(`❌ Unauthorized access for ${symbol} - invalid API key`);
          sendErrorMessage(`Unauthorized access for ${symbol} - check API key`);
          return null;
        } else if (response.status === 403) {
          console.error(`❌ Forbidden access for ${symbol} - insufficient permissions`);
          sendErrorMessage(`Forbidden access for ${symbol} - insufficient permissions`);
          return null;
        } else if (response.status === 429) {
          console.error(`❌ Rate limit exceeded for ${symbol}`);
          sendErrorMessage(`Rate limit exceeded for ${symbol}`);
          return null;
        }
        
        if (response.ok) {
          const data = await response.json();
          console.log(`💰 Quote data for ${symbol}:`, data);
          
          if (data.c === 0 && data.d === 0) {
            console.warn(`⚠️ Warning: ${symbol} returned zero values - may be invalid symbol or market closed`);
          }
          
          return {
            symbol,
            currentPrice: data.c || 0,
            change: data.d || 0,
            changePercent: data.dp || 0,
            high: data.h || 0,
            low: data.l || 0,
            open: data.o || 0,
            previousClose: data.pc || 0,
            timestamp: Date.now()
          };
        } else {
          const errorText = await response.text();
          console.error(`❌ Quote API failed for ${symbol}:`, response.status, errorText);
          sendErrorMessage(`❌ Quote API failed for ${symbol}: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error(`❌ Exception fetching quote for ${symbol}:`, error);
        sendErrorMessage(`❌ Exception fetching quote for ${symbol}: ${error.message}`);
      }
      return null;
    };

    socket.onopen = () => {
      console.log("✅ Client WebSocket connection established");
      sendDebugMessage('✅ Edge function WebSocket connection established');
      connectToFinnhub();
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Message from client:', data);
        
        if (data.type === 'subscribe') {
          symbols = data.symbols || [];
          console.log('📡 Client subscribing to symbols:', symbols);
          sendDebugMessage(`📡 Subscribing to symbols: ${symbols.join(', ')}`);
          
          // Get initial quotes and send to client
          for (const symbol of symbols) {
            const initialQuote = await getInitialQuote(symbol);
            if (initialQuote) {
              priceCache[symbol] = initialQuote;
              
              console.log(`📤 Sending initial quote for ${symbol}:`, initialQuote);
              
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                  type: 'price_update',
                  symbol,
                  data: initialQuote
                }));
              }
            }
          }
          
          // Subscribe to Finnhub for real-time trades
          subscribeToSymbols();
        } else if (data.type === 'ping') {
          console.log('🏓 Received ping from client, sending pong');
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          }
        }
      } catch (error) {
        console.error('❌ Error processing client message:', error);
        sendDebugMessage(`❌ Error processing client message: ${error.message}`);
      }
    };

    socket.onclose = () => {
      console.log("🔌 Client WebSocket connection closed");
      isManualClose = true;
      stopFinnhubKeepAlive();
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (finnhubWs) {
        symbols.forEach(symbol => {
          try {
            finnhubWs?.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}));
          } catch (err) {
            console.error('Error unsubscribing:', err);
          }
        });
        finnhubWs.close();
      }
    };

    return response;
  } catch (error) {
    console.error('❌ Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check Supabase Edge Function logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
