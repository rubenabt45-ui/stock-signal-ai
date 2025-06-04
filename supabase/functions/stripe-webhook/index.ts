
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
    logStep('Signature verification', { isValid, expectedSig: expectedSig.substring(0, 10) + '...', received: v1.substring(0, 10) + '...' });
    
    return isValid;
  } catch (error) {
    logStep('Signature verification error', { error: error.message });
    return false;
  }
}

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

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      logStep('Processing checkout session', { sessionId: session.id });

      // Extract user ID from metadata
      const userId = session.metadata?.user_id;
      if (!userId) {
        logStep('ERROR: No user_id found in session metadata', { metadata: session.metadata });
        return new Response('No user ID in metadata', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      logStep('Found user ID in metadata', { userId });

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

      // Update user profile to set is_pro = true
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          is_pro: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        logStep('ERROR: Failed to update user profile', { error: error.message, userId });
        return new Response('Database update failed', { 
          status: 500, 
          headers: corsHeaders 
        });
      }

      if (!data || data.length === 0) {
        logStep('WARNING: No user profile found for update', { userId });
        return new Response('User profile not found', { 
          status: 404, 
          headers: corsHeaders 
        });
      }

      logStep('Successfully updated user to Pro', { 
        userId, 
        updatedProfile: data[0] 
      });

      return new Response('Webhook processed successfully', { 
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
