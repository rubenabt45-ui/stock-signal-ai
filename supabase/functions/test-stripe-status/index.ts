
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      return new Response('Missing Stripe secret key', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Create Supabase clients
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('No authorization header', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response('Authentication failed', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const user = userData.user;

    // Get user profile from Supabase
    const { data: profile, error: profileError } = await supabaseService
      .from('user_profiles')
      .select('subscription_tier, subscription_status, subscription_end, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    let stripeData = null;
    let stripeSubscriptionId = null;

    // Get Stripe data if customer exists
    if (profile?.stripe_customer_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          stripeSubscriptionId = subscription.id;
          stripeData = {
            subscription_status: subscription.status,
            current_period_end: subscription.current_period_end,
            price_id: subscription.items.data[0]?.price?.id || null,
          };
        }
      } catch (stripeError) {
        console.error('Stripe lookup error:', stripeError);
      }
    }

    // Calculate isPremium flag
    const isPremium = profile?.subscription_tier === 'pro' && 
                     (profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing');

    const response = {
      supabase: {
        plan_tier: profile?.subscription_tier || 'free',
        subscription_status: profile?.subscription_status || 'inactive',
        current_period_end: profile?.subscription_end || null,
        stripe_customer_id: profile?.stripe_customer_id || null,
        stripe_subscription_id: stripeSubscriptionId,
      },
      stripe: stripeData,
      isPremium,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Status check failed:', error);
    return new Response(JSON.stringify({ 
      error: 'Status check failed' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
