
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
  console.log(`[GET-CHECKOUT-SESSION] ${step}${detailsStr}`);
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
    logStep('Get checkout session started');

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      logStep('ERROR: STRIPE_SECRET_KEY not configured');
      return new Response('Stripe secret key not configured', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Create Supabase client using anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep('ERROR: No authorization header provided');
      return new Response('No authorization header', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep('ERROR: Authentication failed', { error: userError?.message });
      return new Response('Authentication failed', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const user = userData.user;
    logStep('User authenticated', { userId: user.id, email: user.email });

    // Get session ID from request body
    const { sessionId } = await req.json();
    if (!sessionId) {
      logStep('ERROR: No session ID provided');
      return new Response('Session ID required', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep('Retrieved checkout session', { 
      sessionId: session.id, 
      status: session.status,
      customerEmail: session.customer_email 
    });

    // Verify the session belongs to the current user
    if (session.metadata?.user_id !== user.id) {
      logStep('ERROR: Session does not belong to current user', { 
        sessionUserId: session.metadata?.user_id, 
        currentUserId: user.id 
      });
      return new Response('Unauthorized access to session', { 
        status: 403, 
        headers: corsHeaders 
      });
    }

    // Return session details
    return new Response(JSON.stringify({ 
      sessionId: session.id,
      status: session.status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      metadata: session.metadata
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR: Get checkout session failed', { error: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve checkout session',
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
