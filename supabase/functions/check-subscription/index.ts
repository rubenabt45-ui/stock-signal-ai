import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, checking for existing PRO status");
      
      // Check if user already has PRO access (founder/manual override)
      const { data: existingProfile } = await supabaseClient
        .from("user_profiles")
        .select("subscription_tier, is_pro, subscription_expires_at")
        .eq('id', user.id)
        .single();
      
      // If user has active PRO access, don't override it
      if (existingProfile?.is_pro && existingProfile?.subscription_tier === 'pro') {
        const expiry = existingProfile.subscription_expires_at ? new Date(existingProfile.subscription_expires_at) : null;
        const isExpired = expiry ? expiry < new Date() : false;
        
        if (!isExpired) {
          logStep("Preserving existing PRO access for founder");
          return new Response(JSON.stringify({ 
            subscribed: true, 
            subscription_tier: "pro",
            subscription_end: existingProfile.subscription_expires_at 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      }
      
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: "free",
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      // Also update user_profiles
      await supabaseClient.from("user_profiles").update({
        subscription_tier: "free",
        subscription_status: "inactive",
        stripe_customer_id: null,
        subscription_end: null,
        is_pro: false,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: "free",
        subscription_end: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "free";
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      // For our $9.99/month plan
      if (amount >= 999) {
        subscriptionTier = "pro";
      }
      logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
    } else {
      logStep("No active subscription found, checking for existing PRO status");
      
      // Check if user already has PRO access (founder/manual override)
      const { data: existingProfile } = await supabaseClient
        .from("user_profiles")
        .select("subscription_tier, is_pro, subscription_expires_at")
        .eq('id', user.id)
        .single();
      
      // If user has active PRO access, preserve it
      if (existingProfile?.is_pro && existingProfile?.subscription_tier === 'pro') {
        const expiry = existingProfile.subscription_expires_at ? new Date(existingProfile.subscription_expires_at) : null;
        const isExpired = expiry ? expiry < new Date() : false;
        
        if (!isExpired) {
          logStep("Preserving existing PRO access for founder");
          subscriptionTier = "pro";
          subscriptionEnd = existingProfile.subscription_expires_at;
          hasActiveSub = true; // Treat as active subscription
        }
      }
    }

    // Update both tables
    await Promise.all([
      supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' }),
      
      supabaseClient.from("user_profiles").update({
        subscription_tier: subscriptionTier,
        subscription_status: hasActiveSub ? "active" : "inactive",
        stripe_customer_id: customerId,
        subscription_end: subscriptionEnd,
        is_pro: subscriptionTier === "pro",
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)
    ]);

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});