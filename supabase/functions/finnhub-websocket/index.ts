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

    // Get Finnhub API key from environment
    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY')
    console.log('🔑 Environment check - Finnhub API key exists:', !!finnhubApiKey)
    
    if (finnhubApiKey) {
      console.log('🔑 Finnhub API key preview:', finnhubApiKey.substring(0, 6) + '...')
      console.log('🔑 Finnhub API key length:', finnhubApiKey.length)
    } else {
      console.error('❌ CRITICAL: FINNHUB_API_KEY not found in environment')
      throw new Error('Finnhub API key not configured in Supabase Vault')
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

    const sendDebugMessage = (message: string) => {
      console.log('🔍 DEBUG:', message);
      try {
        socket.send(JSON.stringify({
          type: 'debug',
          message: message,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error('Failed to send debug message:', err);
      }
    };

    // Keep-alive for Finnhub connection
    const startFinnhubKeepAlive = () => {
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      console.log('💓 Starting Finnhub keep-alive interval (30 seconds)');
      keepAliveInterval = setInterval(() => {
        if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) {
          console.log('💓 Sending ping to Finnhub');
          finnhubWs.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000); // 30 seconds
    };

    const stopFinnhubKeepAlive = () => {
      if (keepAliveInterval) {
        console.log('🛑 Stopping Finnhub keep-alive interval');
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }
    };

    const connectToFinnhub = () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('❌ Max Finnhub reconnection attempts reached');
        sendDebugMessage('❌ Max Finnhub reconnection attempts reached');
        return;
      }

      const finnhubWsUrl = `wss://ws.finnhub.io?token=${finnhubApiKey}`;
      console.log('🔌 Connecting to Finnhub WebSocket...');
      console.log('🌐 Finnhub WS URL structure: wss://ws.finnhub.io?token=', finnhubApiKey?.substring(0, 6) + '...');
      
      sendDebugMessage(`Connecting to Finnhub (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
      
      finnhubWs = new WebSocket(finnhubWsUrl);
      
      finnhubWs.onopen = () => {
        console.log('✅ Successfully connected to Finnhub WebSocket!');
        sendDebugMessage('✅ Connected to Finnhub WebSocket successfully');
        reconnectAttempts = 0; // Reset on successful connection
        
        // Start keep-alive
        startFinnhubKeepAlive();
        
        // Subscribe to symbols when connection opens
        symbols.forEach(symbol => {
          const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol});
          console.log(`📡 Subscribing to Finnhub trades for ${symbol}:`, subscribeMsg);
          finnhubWs?.send(subscribeMsg);
          sendDebugMessage(`📡 Subscribed to ${symbol} trades on Finnhub`);
        });
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
                socket.send(JSON.stringify({
                  type: 'price_update',
                  symbol,
                  data: priceData
                }));

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
        
        // Reconnect with exponential backoff if not a normal closure
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
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
          sendDebugMessage('❌ Finnhub connection failed permanently');
          
          socket.send(JSON.stringify({
            type: 'error',
            error: `Finnhub WebSocket connection failed: ${event.code} - ${event.reason}`
          }));
        }
      };

      finnhubWs.onerror = (error) => {
        console.error('❌ Finnhub WebSocket error:', error);
        sendDebugMessage(`❌ Finnhub WebSocket error: ${error}`);
        stopFinnhubKeepAlive();
        
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to connect to Finnhub WebSocket'
        }));
      };
    };

    const getInitialQuote = async (symbol: string) => {
      try {
        console.log(`📊 Fetching initial quote for ${symbol} from Finnhub REST API...`);
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
        console.log('🌐 Quote URL structure: https://finnhub.io/api/v1/quote?symbol=SYMBOL&token=', finnhubApiKey?.substring(0, 6) + '...');
        
        const response = await fetch(quoteUrl);
        console.log(`📈 Quote API response status for ${symbol}:`, response.status);
        
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
          sendDebugMessage(`❌ Quote API failed for ${symbol}: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error(`❌ Exception fetching quote for ${symbol}:`, error);
        sendDebugMessage(`❌ Exception fetching quote for ${symbol}: ${error.message}`);
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
              
              socket.send(JSON.stringify({
                type: 'price_update',
                symbol,
                data: initialQuote
              }));
            }
          }
          
          // Subscribe to Finnhub for real-time trades
          if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) {
            symbols.forEach(symbol => {
              const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol});
              console.log(`📡 Subscribing to real-time trades for ${symbol}:`, subscribeMsg);
              finnhubWs?.send(subscribeMsg);
              sendDebugMessage(`📡 Subscribed to ${symbol} on Finnhub`);
            });
          } else {
            console.log('⏳ Finnhub WebSocket not ready, will subscribe when connected');
            sendDebugMessage('⏳ Finnhub WebSocket not ready, will subscribe when connected');
          }
        } else if (data.type === 'ping') {
          console.log('🏓 Received ping from client, sending pong');
          socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch (error) {
        console.error('❌ Error processing client message:', error);
        sendDebugMessage(`❌ Error processing client message: ${error.message}`);
      }
    };

    socket.onclose = () => {
      console.log("🔌 Client WebSocket connection closed");
      stopFinnhubKeepAlive();
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (finnhubWs) {
        symbols.forEach(symbol => {
          finnhubWs?.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}));
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
