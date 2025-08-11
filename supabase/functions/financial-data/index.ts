
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FINANCIAL-DATA] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Financial data request started");

    const apiKey = Deno.env.get('FMP_API_KEY');
    if (!apiKey) {
      logStep("ERROR: FMP_API_KEY not configured");
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const symbol = url.searchParams.get('symbol');
    
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Endpoint parameter required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Construct the FMP API URL
    let fmpUrl = `https://financialmodelingprep.com/api/v4/${endpoint}`;
    
    // Add symbol parameter if provided
    if (symbol) {
      fmpUrl += `/${symbol}`;
    }
    
    // Add API key
    fmpUrl += `?apikey=${apiKey}`;
    
    // Add any additional query parameters from the original request
    const additionalParams = new URLSearchParams();
    url.searchParams.forEach((value, key) => {
      if (key !== 'endpoint' && key !== 'symbol') {
        additionalParams.append(key, value);
      }
    });
    
    if (additionalParams.toString()) {
      fmpUrl += `&${additionalParams.toString()}`;
    }

    logStep("Making FMP API request", { endpoint, symbol });

    const response = await fetch(fmpUrl);
    const data = await response.json();

    if (!response.ok) {
      logStep("FMP API error", { status: response.status, data });
      return new Response(JSON.stringify({ error: 'Financial data API error', details: data }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    logStep("Successfully fetched financial data");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR: Financial data request failed", { error: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch financial data',
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
