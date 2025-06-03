
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
    console.log('🚀 Edge function started - checking environment variables...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get Finnhub API key from environment
    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY')
    console.log('🔑 Finnhub API key status:', finnhubApiKey ? `Found (${finnhubApiKey.substring(0, 8)}...)` : 'NOT FOUND')
    
    if (!finnhubApiKey) {
      console.error('❌ CRITICAL: Finnhub API key not found in Supabase Vault')
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

    const getInitialQuote = async (symbol: string) => {
      try {
        console.log(`📊 Fetching initial quote for ${symbol} from Finnhub REST API...`);
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
        console.log('🌐 Quote URL:', quoteUrl.replace(finnhubApiKey, 'HIDDEN_TOKEN'));
        
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
          sendDebugMessage(`Quote API failed for ${symbol}: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error(`❌ Exception fetching quote for ${symbol}:`, error);
        sendDebugMessage(`Exception fetching quote for ${symbol}: ${error.message}`);
      }
      return null;
    };

    const connectToFinnhub = () => {
      const finnhubWsUrl = `wss://ws.finnhub.io?token=${finnhubApiKey}`;
      console.log('🔌 Connecting to Finnhub WebSocket...');
      console.log('🌐 Finnhub WS URL:', finnhubWsUrl.replace(finnhubApiKey, 'HIDDEN_TOKEN'));
      
      sendDebugMessage(`Connecting to Finnhub with API key: ${finnhubApiKey.substring(0, 8)}...`);
      
      finnhubWs = new WebSocket(finnhubWsUrl);
      
      finnhubWs.onopen = () => {
        console.log('✅ Successfully connected to Finnhub WebSocket!');
        sendDebugMessage('Connected to Finnhub WebSocket successfully');
        
        // Subscribe to symbols when connection opens
        symbols.forEach(symbol => {
          const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol});
          console.log(`📡 Subscribing to Finnhub trades for ${symbol}:`, subscribeMsg);
          finnhubWs?.send(subscribeMsg);
          sendDebugMessage(`Subscribed to ${symbol} trades on Finnhub`);
        });
      };

      finnhubWs.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Raw message from Finnhub:', data);
          
          if (data.type === 'trade' && data.data && data.data.length > 0) {
            console.log(`📈 Processing ${data.data.length} trade(s) from Finnhub`);
            sendDebugMessage(`Received ${data.data.length} trades from Finnhub`);
            
            for (const trade of data.data) {
              const symbol = trade.s;
              const price = trade.p;
              const volume = trade.v;
              const timestamp = trade.t;

              console.log(`💹 Trade received: ${symbol} @ $${price} (vol: ${volume}, time: ${timestamp})`);

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
                sendDebugMessage(`Live price: ${symbol} = $${price}`);

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
          } else {
            console.log('📨 Other message type from Finnhub:', data.type, data);
          }
        } catch (error) {
          console.error('❌ Error processing Finnhub message:', error, 'Raw event:', event.data);
          sendDebugMessage(`Error processing Finnhub message: ${error.message}`);
        }
      };

      finnhubWs.onclose = (event) => {
        console.log('🔌 Finnhub WebSocket closed:', event.code, event.reason, 'Clean:', event.wasClean);
        sendDebugMessage(`Finnhub connection closed: ${event.code} - ${event.reason}`);
        
        // Reconnect after delay
        setTimeout(() => {
          console.log('🔄 Reconnecting to Finnhub...');
          sendDebugMessage('Reconnecting to Finnhub...');
          connectToFinnhub();
        }, 5000);
      };

      finnhubWs.onerror = (error) => {
        console.error('❌ Finnhub WebSocket error:', error);
        sendDebugMessage(`Finnhub WebSocket error: ${error}`);
        
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to connect to Finnhub WebSocket'
        }));
      };
    };

    socket.onopen = () => {
      console.log("✅ Client WebSocket connection established");
      sendDebugMessage('Edge function WebSocket connection established');
      connectToFinnhub();
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Message from client:', data);
        
        if (data.type === 'subscribe') {
          symbols = data.symbols || [];
          console.log('📡 Client subscribing to symbols:', symbols);
          sendDebugMessage(`Subscribing to symbols: ${symbols.join(', ')}`);
          
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
            });
          } else {
            console.log('⏳ Finnhub WebSocket not ready, will subscribe when connected');
            sendDebugMessage('Finnhub WebSocket not ready, will subscribe when connected');
          }
        }
      } catch (error) {
        console.error('❌ Error processing client message:', error);
        sendDebugMessage(`Error processing client message: ${error.message}`);
      }
    };

    socket.onclose = () => {
      console.log("🔌 Client WebSocket connection closed");
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
