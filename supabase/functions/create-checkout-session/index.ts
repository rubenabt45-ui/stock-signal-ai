
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    logStep('Invalid method', { method: req.method });
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    logStep('Checkout session creation started');

    // Validate required environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePriceId = Deno.env.get('STRIPE_PRICE_ID_PRO');
    
    if (!stripeSecretKey) {
      logStep('ERROR: STRIPE_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Stripe secret key not configured' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!stripePriceId) {
      logStep('ERROR: STRIPE_PRICE_ID_PRO not configured');
      return new Response(JSON.stringify({ error: 'Stripe price ID not configured' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    logStep('Environment variables validated', { priceId: stripePriceId });

    // Create Supabase client using anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep('ERROR: No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep('ERROR: Authentication failed', { error: userError?.message });
      return new Response(JSON.stringify({ error: 'Authentication failed' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const user = userData.user;
    logStep('User authenticated', { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep('Found existing customer', { customerId });
    } else {
      logStep('No existing customer found, will create during checkout');
    }

    // Get origin for redirect URLs
    const origin = req.headers.get('origin') || 'https://lovable.dev/projects/351714c7-a4c6-4f25-bf5f-a3c37bdee2ed';

    // Create checkout session using the configured price ID
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        user_id: user.id, // This is critical for the webhook
      },
      subscription_data: {
        metadata: {
          user_id: user.id, // Also add to subscription metadata for future events
        },
      },
    });

    logStep('Checkout session created successfully', { 
      sessionId: session.id, 
      url: session.url,
      metadata: session.metadata,
      priceId: stripePriceId
    });

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR: Checkout session creation failed', { error: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to create checkout session',
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

