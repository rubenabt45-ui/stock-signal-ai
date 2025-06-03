
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const { symbol } = await req.json()
    
    if (!symbol) {
      throw new Error('Symbol is required')
    }

    // Fetch real-time price from Finnhub
    const finnhubResponse = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`
    )

    if (!finnhubResponse.ok) {
      throw new Error(`Finnhub API error: ${finnhubResponse.status}`)
    }

    const priceData = await finnhubResponse.json()
    
    // Store the price update in our database
    const { error } = await supabaseClient
      .from('price_updates')
      .insert({
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

    if (error) {
      console.error('Database error:', error)
    }

    return new Response(
      JSON.stringify({
        symbol,
        currentPrice: priceData.c,
        change: priceData.d,
        changePercent: priceData.dp,
        high: priceData.h,
        low: priceData.l,
        open: priceData.o,
        previousClose: priceData.pc,
        timestamp: Date.now()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
