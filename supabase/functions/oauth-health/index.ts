
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
    const url = new URL(req.url)
    const provider = url.searchParams.get('provider')
    const redirect = url.searchParams.get('redirect') || `${url.origin}/auth/callback`
    
    if (!provider || !['google', 'github'].includes(provider)) {
      return new Response(
        JSON.stringify({ error: 'Invalid provider. Use google or github' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: 'SUPABASE_URL not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirect)}`
    
    console.log('[OAUTH-HEALTH] Checking:', { provider, redirect, authUrl })
    
    const res = await fetch(authUrl, { 
      method: 'GET', 
      redirect: 'manual' 
    })
    
    const status = res.status
    const location = res.headers.get('location') || null
    let bodyText = null
    
    try {
      bodyText = await res.text()
    } catch (e) {
      console.log('[OAUTH-HEALTH] Failed to read body:', e)
    }
    
    const result = {
      status,
      location,
      bodyText,
      url: authUrl,
      provider,
      redirect,
      timestamp: new Date().toISOString()
    }
    
    console.log('[OAUTH-HEALTH] Result:', result)
    
    return new Response(
      JSON.stringify(result, null, 2),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('[OAUTH-HEALTH] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
