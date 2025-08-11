
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if Stripe testing is enabled
  const testingEnabled = Deno.env.get('VITE_ENABLE_STRIPE_TEST') === 'true';
  if (!testingEnabled) {
    return new Response('Not Found', { 
      status: 404, 
      headers: corsHeaders 
    });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Check presence of required environment variables (boolean only, no values)
    const envStatus = {
      STRIPE_SECRET_KEY: !!Deno.env.get('STRIPE_SECRET_KEY'),
      STRIPE_WEBHOOK_SECRET: !!Deno.env.get('STRIPE_WEBHOOK_SECRET'),
      STRIPE_PUBLISHABLE_KEY: !!Deno.env.get('STRIPE_PUBLISHABLE_KEY'),
      STRIPE_PRICE_ID_PRO: !!Deno.env.get('STRIPE_PRICE_ID_PRO'),
      SUPABASE_URL: !!Deno.env.get('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    };

    const allPresent = Object.values(envStatus).every(Boolean);

    return new Response(JSON.stringify({
      ...envStatus,
      allRequired: allPresent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Environment check failed:', error);
    return new Response(JSON.stringify({ 
      error: 'Environment check failed' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
