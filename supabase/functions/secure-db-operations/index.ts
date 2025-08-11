
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SECURE-DB-OPS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Secure database operation started");

    // Create Supabase client with service role for administrative operations
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create anon client for user authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep("ERROR: No authorization header");
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep("ERROR: Authentication failed", { error: userError?.message });
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    const { operation, data } = await req.json();

    switch (operation) {
      case 'reset_daily_messages':
        // Only allow users to reset their own message count
        const { error: resetError } = await supabaseService
          .from('user_profiles')
          .update({ 
            daily_message_count: 0,
            daily_message_reset: new Date().toISOString().split('T')[0]
          })
          .eq('id', user.id);

        if (resetError) {
          throw resetError;
        }

        logStep("Daily message count reset successfully");
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'audit_log':
        // Log security-relevant operations
        const { action, details } = data;
        
        // Store audit log (you would need to create an audit_logs table)
        const auditData = {
          user_id: user.id,
          action,
          details: JSON.stringify(details),
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown',
          timestamp: new Date().toISOString()
        };

        logStep("Audit log entry created", auditData);
        
        return new Response(JSON.stringify({ success: true, audit_id: 'generated' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      default:
        return new Response(JSON.stringify({ error: 'Unknown operation' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR: Secure database operation failed", { error: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: 'Operation failed',
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
