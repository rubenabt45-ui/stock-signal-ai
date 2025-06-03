
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Edge function started - WebSocket upgrade requested');
    
    // Immediately upgrade to WebSocket without any blocking operations
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 })
    }

    console.log('🔌 Upgrading to WebSocket connection...');
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    let symbols: string[] = []
    let finnhubWs: WebSocket | null = null
    let finnhubApiKey: string | null = null
    
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

    const connectToFinnhub = async () => {
      if (!finnhubApiKey) {
        sendErrorMessage('Finnhub API key not available');
        return;
      }

      const finnhubWsUrl = `wss://ws.finnhub.io?token=${finnhubApiKey}`;
      console.log('🔌 Connecting to Finnhub WebSocket...');
      sendDebugMessage('Connecting to Finnhub WebSocket...');
      
      try {
        finnhubWs = new WebSocket(finnhubWsUrl);
        
        finnhubWs.onopen = () => {
          console.log('✅ Successfully connected to Finnhub WebSocket!');
          sendDebugMessage('✅ Connected to Finnhub WebSocket successfully');
          
          // Subscribe to any pending symbols
          if (symbols.length > 0) {
            symbols.forEach(symbol => {
              const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol});
              console.log(`📡 Subscribing to ${symbol}:`, subscribeMsg);
              try {
                finnhubWs?.send(subscribeMsg);
                sendDebugMessage(`📡 Subscribed to ${symbol}`);
              } catch (err) {
                console.error(`❌ Failed to subscribe to ${symbol}:`, err);
                sendErrorMessage(`Failed to subscribe to ${symbol}: ${err.message}`);
              }
            });
          }
        };

        finnhubWs.onmessage = (event) => {
          try {
            // Log ALL raw messages from Finnhub
            console.log('💹 RAW Finnhub message:', event.data);
            
            const data = JSON.parse(event.data);
            console.log('📨 Parsed Finnhub data:', JSON.stringify(data, null, 2));
            
            if (data.type === 'trade' && data.data && data.data.length > 0) {
              console.log(`📈 Processing ${data.data.length} trade(s) from Finnhub`);
              
              for (const trade of data.data) {
                const symbol = trade.s;
                const price = trade.p;
                const timestamp = trade.t;

                console.log(`💰 Live trade: ${symbol} @ $${price} (time: ${timestamp})`);
                
                const priceData = {
                  symbol,
                  currentPrice: price,
                  change: 0, // Will be calculated on frontend
                  changePercent: 0, // Will be calculated on frontend
                  high: price,
                  low: price,
                  open: price,
                  previousClose: price,
                  timestamp: Date.now()
                };

                const messageToSend = {
                  type: 'price_update',
                  symbol,
                  data: priceData
                };

                console.log(`📤 Sending to frontend:`, JSON.stringify(messageToSend));

                // Send to client
                if (socket.readyState === WebSocket.OPEN) {
                  socket.send(JSON.stringify(messageToSend));
                  console.log(`✅ Message sent successfully to frontend`);
                } else {
                  console.log(`❌ Frontend socket not ready (state: ${socket.readyState})`);
                }
              }
            } else if (data.type === 'ping') {
              console.log('🏓 Received ping from Finnhub');
              sendDebugMessage('🏓 Received ping from Finnhub');
            } else if (data.type === 'error') {
              console.error('❌ Finnhub error:', data);
              sendErrorMessage(`Finnhub error: ${JSON.stringify(data)}`);
            } else {
              console.log('📨 Other message from Finnhub:', data.type, data);
              sendDebugMessage(`📨 Other Finnhub message: ${data.type}`);
            }
          } catch (error) {
            console.error('❌ Error processing Finnhub message:', error);
            console.error('❌ Raw message was:', event.data);
            sendErrorMessage(`Error processing Finnhub message: ${error.message}`);
          }
        };

        finnhubWs.onclose = (event) => {
          console.log('🔌 Finnhub WebSocket closed:', event.code, event.reason);
          sendErrorMessage(`Finnhub connection closed: ${event.code} - ${event.reason}`);
        };

        finnhubWs.onerror = (error) => {
          console.error('❌ Finnhub WebSocket error:', error);
          sendErrorMessage(`Finnhub WebSocket error: ${error}`);
        };
      } catch (err) {
        console.error('❌ Failed to create Finnhub WebSocket:', err);
        sendErrorMessage(`Failed to create WebSocket: ${err.message}`);
      }
    };

    // Handle client WebSocket connection
    socket.onopen = async () => {
      console.log("✅ Client WebSocket connection established");
      sendDebugMessage('✅ Edge function WebSocket connection established');
      
      // Now safely get the API key after WebSocket is established
      try {
        finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
        console.log('🔑 API key loaded - length:', finnhubApiKey?.length || 0);
        console.log('🔑 API key preview:', finnhubApiKey?.substring(0, 6) || 'NOT_FOUND');
        
        if (!finnhubApiKey) {
          sendErrorMessage('❌ FINNHUB_API_KEY not found in environment');
          return;
        }
        
        if (!/^[a-zA-Z0-9]+$/.test(finnhubApiKey)) {
          sendErrorMessage('❌ Invalid API key format');
          return;
        }
        
        sendDebugMessage(`✅ API key validated (${finnhubApiKey.length} chars)`);
        
        // Connect to Finnhub after API key is validated
        await connectToFinnhub();
        
      } catch (error) {
        console.error('❌ Error during initialization:', error);
        sendErrorMessage(`Initialization error: ${error.message}`);
      }
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Message from client:', data);
        
        if (data.type === 'subscribe') {
          symbols = data.symbols || [];
          console.log('📡 Client subscribing to symbols:', symbols);
          sendDebugMessage(`📡 Subscribing to symbols: ${symbols.join(', ')}`);
          
          // If Finnhub is connected, subscribe immediately
          if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) {
            symbols.forEach(symbol => {
              const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol});
              console.log(`📡 Sending subscription for ${symbol}:`, subscribeMsg);
              try {
                finnhubWs?.send(subscribeMsg);
                sendDebugMessage(`📡 Subscribed to ${symbol}`);
                console.log(`✅ Successfully subscribed to ${symbol}`);
              } catch (err) {
                console.error(`❌ Failed to subscribe to ${symbol}:`, err);
                sendErrorMessage(`Failed to subscribe to ${symbol}: ${err.message}`);
              }
            });
          } else {
            sendDebugMessage('⏳ Finnhub not ready, will subscribe when connected');
            console.log('⏳ Finnhub WebSocket state:', finnhubWs?.readyState);
          }
        } else if (data.type === 'ping') {
          console.log('🏓 Received ping from client, sending pong');
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          }
        }
      } catch (error) {
        console.error('❌ Error processing client message:', error);
        sendErrorMessage(`Error processing client message: ${error.message}`);
      }
    };

    socket.onclose = () => {
      console.log("🔌 Client WebSocket connection closed");
      if (finnhubWs) {
        symbols.forEach(symbol => {
          try {
            finnhubWs?.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}));
            console.log(`🛑 Unsubscribed from ${symbol}`);
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
