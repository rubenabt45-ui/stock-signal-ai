
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
    let intervalId: number

    socket.onopen = () => {
      console.log("WebSocket connection opened")
    }

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'subscribe') {
          symbols = data.symbols || []
          console.log('Subscribing to symbols:', symbols)
          
          // Clear existing interval
          if (intervalId) clearInterval(intervalId)
          
          // Start polling for price updates every 2 seconds for demo
          intervalId = setInterval(async () => {
            for (const symbol of symbols) {
              try {
                const finnhubResponse = await fetch(
                  `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`
                )
                
                if (finnhubResponse.ok) {
                  const priceData = await finnhubResponse.json()
                  
                  // Send real-time update to client
                  socket.send(JSON.stringify({
                    type: 'price_update',
                    symbol,
                    data: {
                      symbol,
                      currentPrice: priceData.c,
                      change: priceData.d,
                      changePercent: priceData.dp,
                      high: priceData.h,
                      low: priceData.l,
                      open: priceData.o,
                      previousClose: priceData.pc,
                      timestamp: Date.now()
                    }
                  }))

                  // Store in database
                  await supabaseClient
                    .from('price_updates')
                    .upsert({
                      symbol,
                      current_price: priceData.c,
                      change: priceData.d,
                      change_percent: priceData.dp,
                      high: priceData.h,
                      low: priceData.l,
                      open: priceData.o,
                      previous_close: priceData.pc,
                      timestamp: new Date().toISOString()
                    })
                }
              } catch (error) {
                console.error(`Error fetching data for ${symbol}:`, error)
              }
            }
          }, 2000) // Update every 2 seconds
        }
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    }

    socket.onclose = () => {
      if (intervalId) clearInterval(intervalId)
      console.log("WebSocket connection closed")
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
