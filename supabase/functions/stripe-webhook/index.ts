
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Function to verify Stripe webhook signature
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Extract timestamp and signature from header
    const elements = signature.split(',');
    let timestamp = '';
    let v1 = '';

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') timestamp = value;
      if (key === 'v1') v1 = value;
    }

    if (!timestamp || !v1) {
      logStep('Missing timestamp or signature in header');
      return false;
    }

    // Create signed payload
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    );

    // Convert to hex string
    const expectedSig = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = expectedSig === v1;
    logStep('Signature verification', { isValid });
    
    return isValid;
  } catch (error) {
    logStep('Signature verification error', { error: error.message });
    return false;
  }
}

// Function to update user profile
async function updateUserProfile(supabase: any, userId: string, updates: any) {
  logStep('Updating user profile', { userId, updates });

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      logStep('ERROR: Failed to update user profile', { error });
      throw error;
    }

    logStep('Successfully updated user profile', { data });
    return data;
  } catch (error) {
    logStep('ERROR: User profile update failed', { error });
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    logStep('Invalid method', { method: req.method });
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    logStep('Webhook function started');

    // Get webhook secret from environment
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      logStep('ERROR: STRIPE_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Get Stripe signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      logStep('ERROR: Missing Stripe signature header');
      return new Response('Missing Stripe signature', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Get request body
    const payload = await req.text();
    logStep('Received webhook payload', { payloadLength: payload.length });

    // Verify webhook signature
    const isValidSignature = await verifyStripeSignature(payload, signature, webhookSecret);
    if (!isValidSignature) {
      logStep('ERROR: Invalid webhook signature');
      return new Response('Invalid signature', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Parse the event
    const event = JSON.parse(payload);
    logStep('Parsed Stripe event', { type: event.type, id: event.id });

    // Initialize Supabase client with service role for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      logStep('Processing checkout session completed', { 
        sessionId: session.id,
        metadata: session.metadata,
        customerId: session.customer,
        subscriptionId: session.subscription 
      });

      const userId = session.metadata?.user_id;
      if (!userId) {
        logStep('ERROR: No user_id found in session metadata');
        return new Response('No user ID in metadata', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      await updateUserProfile(supabase, userId, {
        subscription_tier: 'pro',
        subscription_status: 'active',
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        is_pro: true
      });

      return new Response('Checkout session processed successfully', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    // Handle customer.subscription.updated event
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      logStep('Processing subscription updated', { 
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      });

      // Find user by subscription ID
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      if (error || !profiles) {
        logStep('ERROR: User not found for subscription', { subscriptionId: subscription.id });
        return new Response('User not found for subscription', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      const updates: any = {
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      };

      // Update tier based on status
      if (subscription.status === 'active' || subscription.status === 'trialing') {
        updates.subscription_tier = 'pro';
        updates.is_pro = true;
      } else {
        updates.subscription_tier = 'free';
        updates.is_pro = false;
      }

      await updateUserProfile(supabase, profiles.id, updates);

      return new Response('Subscription updated successfully', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    // Handle customer.subscription.deleted event
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      logStep('Processing subscription deleted', { 
        subscriptionId: subscription.id,
        customerId: subscription.customer 
      });

      // Find user by subscription ID
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      if (error || !profiles) {
        logStep('ERROR: User not found for subscription', { subscriptionId: subscription.id });
        return new Response('User not found for subscription', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      await updateUserProfile(supabase, profiles.id, {
        subscription_tier: 'free',
        subscription_status: 'canceled',
        is_pro: false
      });

      return new Response('Subscription deletion processed successfully', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    // Handle other event types (just log and return success)
    logStep('Unhandled event type', { type: event.type });
    return new Response('Event type not handled', { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR: Webhook processing failed', { error: errorMessage });
    
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
