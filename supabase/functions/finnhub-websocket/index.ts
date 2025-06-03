
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY')
    if (!finnhubApiKey) {
      throw new Error('Finnhub API key not configured')
    }

    // Create WebSocket connection for real-time streaming
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 })
    }

    const { socket, response } = Deno.upgradeWebSocket(req)
    
    let symbols: string[] = []
    let finnhubWs: WebSocket | null = null

    // Connect to Finnhub WebSocket
    const connectToFinnhub = () => {
      finnhubWs = new WebSocket(`wss://ws.finnhub.io?token=${finnhubApiKey}`)
      
      finnhubWs.onopen = () => {
        console.log('Connected to Finnhub WebSocket')
        // Subscribe to symbols when connection opens
        symbols.forEach(symbol => {
          finnhubWs?.send(JSON.stringify({'type':'subscribe','symbol': symbol}))
        })
      }

      finnhubWs.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'trade' && data.data) {
            // Process trade data from Finnhub
            for (const trade of data.data) {
              const priceData = {
                symbol: trade.s,
                currentPrice: trade.p,
                change: 0, // We'll calculate this from previous close
                changePercent: 0,
                high: trade.p,
                low: trade.p,
                open: trade.p,
                previousClose: trade.p,
                timestamp: Date.now()
              }

              // Send to client
              socket.send(JSON.stringify({
                type: 'price_update',
                symbol: trade.s,
                data: priceData
              }))

              // Store in database
              await supabaseClient
                .from('price_updates')
                .upsert({
                  symbol: trade.s,
                  current_price: trade.p,
                  change: 0,
                  change_percent: 0,
                  high: trade.p,
                  low: trade.p,
                  open: trade.p,
                  previous_close: trade.p,
                  timestamp: new Date().toISOString()
                })
            }
          }
        } catch (error) {
          console.error('Error processing Finnhub message:', error)
        }
      }

      finnhubWs.onclose = () => {
        console.log('Finnhub WebSocket closed, attempting to reconnect...')
        setTimeout(connectToFinnhub, 5000)
      }

      finnhubWs.onerror = (error) => {
        console.error('Finnhub WebSocket error:', error)
      }
    }

    socket.onopen = () => {
      console.log("Client WebSocket connection opened")
      connectToFinnhub()
    }

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'subscribe') {
          symbols = data.symbols || []
          console.log('Subscribing to symbols:', symbols)
          
          // Subscribe to Finnhub for each symbol
          if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) {
            symbols.forEach(symbol => {
              finnhubWs?.send(JSON.stringify({'type':'subscribe','symbol': symbol}))
            })
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    }

    socket.onclose = () => {
      console.log("Client WebSocket connection closed")
      if (finnhubWs) {
        // Unsubscribe from all symbols
        symbols.forEach(symbol => {
          finnhubWs?.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
        })
        finnhubWs.close()
      }
    }

    return response
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
