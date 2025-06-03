
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

    // Get Finnhub API key from Supabase Vault
    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY')
    if (!finnhubApiKey) {
      console.error('❌ Finnhub API key not found in environment')
      throw new Error('Finnhub API key not configured')
    }
    
    console.log('✅ Finnhub API key loaded from Supabase Vault')

    // Create WebSocket connection for real-time streaming
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 })
    }

    const { socket, response } = Deno.upgradeWebSocket(req)
    
    let symbols: string[] = []
    let finnhubWs: WebSocket | null = null
    let priceCache: Record<string, any> = {}

    // Get initial quote data from Finnhub REST API
    const getInitialQuote = async (symbol: string) => {
      try {
        console.log(`📊 Fetching initial quote for ${symbol}`)
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`
        )
        
        if (response.ok) {
          const data = await response.json()
          console.log(`💰 Initial quote for ${symbol}:`, data)
          
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
          }
        } else {
          console.error(`❌ Failed to fetch quote for ${symbol}:`, response.status)
        }
      } catch (error) {
        console.error(`❌ Error fetching initial quote for ${symbol}:`, error)
      }
      return null
    }

    // Connect to Finnhub WebSocket for real-time trades
    const connectToFinnhub = () => {
      const finnhubWsUrl = `wss://ws.finnhub.io?token=${finnhubApiKey}`
      console.log('🔌 Connecting to Finnhub WebSocket:', finnhubWsUrl)
      
      finnhubWs = new WebSocket(finnhubWsUrl)
      
      finnhubWs.onopen = () => {
        console.log('✅ Connected to Finnhub WebSocket')
        
        // Subscribe to symbols when connection opens
        symbols.forEach(symbol => {
          const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol})
          console.log(`📡 Subscribing to ${symbol} with message:`, subscribeMsg)
          finnhubWs?.send(subscribeMsg)
        })
      }

      finnhubWs.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📨 Received from Finnhub:', data)
          
          if (data.type === 'trade' && data.data && data.data.length > 0) {
            console.log(`📈 Processing ${data.data.length} trades`)
            
            // Process real-time trade data from Finnhub
            for (const trade of data.data) {
              const symbol = trade.s
              const price = trade.p
              const volume = trade.v
              const timestamp = trade.t

              console.log(`💹 Trade: ${symbol} @ $${price} (vol: ${volume})`)

              // Update price cache with latest trade
              if (!priceCache[symbol]) {
                // Get initial quote data if we don't have it
                const initialQuote = await getInitialQuote(symbol)
                if (initialQuote) {
                  priceCache[symbol] = initialQuote
                }
              }

              // Update with real-time trade price
              if (priceCache[symbol]) {
                const cachedPrice = priceCache[symbol]
                const change = price - cachedPrice.previousClose
                const changePercent = cachedPrice.previousClose ? (change / cachedPrice.previousClose) * 100 : 0

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
                }

                // Update cache
                priceCache[symbol] = priceData

                console.log(`📤 Sending price update to client:`, priceData)

                // Send to client
                socket.send(JSON.stringify({
                  type: 'price_update',
                  symbol,
                  data: priceData
                }))

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
                    })
                } catch (dbError) {
                  console.error('❌ Database error:', dbError)
                }
              }
            }
          }
        } catch (error) {
          console.error('❌ Error processing Finnhub message:', error)
        }
      }

      finnhubWs.onclose = (event) => {
        console.log('🔌 Finnhub WebSocket closed:', event.code, event.reason)
        setTimeout(() => {
          console.log('🔄 Reconnecting to Finnhub...')
          connectToFinnhub()
        }, 5000)
      }

      finnhubWs.onerror = (error) => {
        console.error('❌ Finnhub WebSocket error:', error)
      }
    }

    socket.onopen = () => {
      console.log("✅ Client WebSocket connection opened")
      connectToFinnhub()
    }

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📨 Received from client:', data)
        
        if (data.type === 'subscribe') {
          symbols = data.symbols || []
          console.log('📡 Client subscribing to symbols:', symbols)
          
          // Get initial quotes for all symbols and send to client
          for (const symbol of symbols) {
            const initialQuote = await getInitialQuote(symbol)
            if (initialQuote) {
              priceCache[symbol] = initialQuote
              
              console.log(`📤 Sending initial quote for ${symbol}:`, initialQuote)
              
              // Send initial quote to client
              socket.send(JSON.stringify({
                type: 'price_update',
                symbol,
                data: initialQuote
              }))
            }
          }
          
          // Subscribe to Finnhub for real-time trades
          if (finnhubWs && finnhubWs.readyState === WebSocket.OPEN) {
            symbols.forEach(symbol => {
              const subscribeMsg = JSON.stringify({'type':'subscribe','symbol': symbol})
              console.log(`📡 Subscribing to real-time trades for ${symbol}:`, subscribeMsg)
              finnhubWs?.send(subscribeMsg)
            })
          }
        }
      } catch (error) {
        console.error('❌ WebSocket message error:', error)
      }
    }

    socket.onclose = () => {
      console.log("🔌 Client WebSocket connection closed")
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
    console.error('❌ Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
