import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  type: 'payment_success' | 'payment_failed' | 'renewal_reminder' | 'subscription_canceled';
  data?: {
    amount?: number;
    next_billing_date?: string;
    subscription_end?: string;
  };
}

const getEmailContent = (type: string, data?: any) => {
  switch (type) {
    case 'payment_success':
      return {
        subject: "🎉 Welcome to TradeIQ Pro!",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #1a1a1a; color: white; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; margin: 0;">TradeIQ Pro</h1>
              <p style="color: #9ca3af; margin: 5px 0;">Premium Trading Intelligence</p>
            </div>
            
            <div style="background: #0f172a; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h2 style="color: #10b981; margin-top: 0;">Payment Successful!</h2>
              <p>Thank you for upgrading to TradeIQ Pro! Your payment of $${(data?.amount || 999) / 100} has been processed successfully.</p>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #3b82f6;">What's included in your Pro subscription:</h3>
                <ul style="color: #d1d5db;">
                  <li>✅ Unlimited StrategyAI messages</li>
                  <li>✅ Real-time market updates</li>
                  <li>✅ Complete learning modules</li>
                  <li>✅ Priority customer support</li>
                  <li>✅ Advanced trading insights</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://lovable.dev/projects/351714c7-a4c6-4f25-bf5f-a3c37bdee2ed/app" 
                   style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Access Your Pro Features
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
              <p>Questions? Reply to this email or contact support.</p>
              <p>TradeIQ Team</p>
            </div>
          </div>
        `
      };
      
    case 'renewal_reminder':
      return {
        subject: "🔔 TradeIQ Pro Renewal Reminder",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #1a1a1a; color: white; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; margin: 0;">TradeIQ Pro</h1>
              <p style="color: #9ca3af; margin: 5px 0;">Premium Trading Intelligence</p>
            </div>
            
            <div style="background: #0f172a; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h2 style="color: #f59e0b; margin-top: 0;">Subscription Renewal</h2>
              <p>Your TradeIQ Pro subscription will renew on <strong>${data?.next_billing_date || 'your next billing date'}</strong>.</p>
              
              <p>You'll continue to enjoy:</p>
              <ul style="color: #d1d5db;">
                <li>✅ Unlimited StrategyAI access</li>
                <li>✅ Real-time market data</li>
                <li>✅ All premium features</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://lovable.dev/projects/351714c7-a4c6-4f25-bf5f-a3c37bdee2ed/app/settings" 
                   style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                  Manage Subscription
                </a>
              </div>
            </div>
          </div>
        `
      };
      
    case 'payment_failed':
      return {
        subject: "⚠️ TradeIQ Pro Payment Failed",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #1a1a1a; color: white; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; margin: 0;">TradeIQ Pro</h1>
              <p style="color: #9ca3af; margin: 5px 0;">Premium Trading Intelligence</p>
            </div>
            
            <div style="background: #0f172a; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
              <h2 style="color: #ef4444; margin-top: 0;">Payment Failed</h2>
              <p>We were unable to process your payment for TradeIQ Pro. Your subscription will expire on <strong>${data?.subscription_end || 'the end date'}</strong> if not resolved.</p>
              
              <p><strong>What you need to do:</strong></p>
              <ul style="color: #d1d5db;">
                <li>Update your payment method</li>
                <li>Ensure sufficient funds are available</li>
                <li>Contact your bank if needed</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://lovable.dev/projects/351714c7-a4c6-4f25-bf5f-a3c37bdee2ed/app/settings" 
                   style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Update Payment Method
                </a>
              </div>
            </div>
          </div>
        `
      };
      
    case 'subscription_canceled':
      return {
        subject: "TradeIQ Pro Subscription Canceled",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #1a1a1a; color: white; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; margin: 0;">TradeIQ Pro</h1>
              <p style="color: #9ca3af; margin: 5px 0;">Premium Trading Intelligence</p>
            </div>
            
            <div style="background: #0f172a; padding: 20px; border-radius: 8px; border-left: 4px solid #6b7280;">
              <h2 style="color: #6b7280; margin-top: 0;">Subscription Canceled</h2>
              <p>Your TradeIQ Pro subscription has been canceled. You'll continue to have access to Pro features until <strong>${data?.subscription_end || 'your subscription end date'}</strong>.</p>
              
              <p>After that, you'll still have access to:</p>
              <ul style="color: #d1d5db;">
                <li>Basic trading tools</li>
                <li>Limited StrategyAI messages</li>
                <li>Core platform features</li>
              </ul>
              
              <p>We'd love to have you back anytime!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://lovable.dev/projects/351714c7-a4c6-4f25-bf5f-a3c37bdee2ed/pricing" 
                   style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Reactivate Pro
                </a>
              </div>
            </div>
          </div>
        `
      };
      
    default:
      return {
        subject: "TradeIQ Pro Update",
        html: "<p>Thank you for using TradeIQ Pro!</p>"
      };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { to, type, data }: EmailRequest = await req.json();
    
    if (!to || !type) {
      return new Response("Missing required fields", { status: 400, headers: corsHeaders });
    }

    const emailContent = getEmailContent(type, data);
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'TradeIQ Pro <noreply@resend.dev>',
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw error;
    }

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, id: emailData?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-subscription-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});