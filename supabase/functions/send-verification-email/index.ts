import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  user: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    
    // Parse the webhook payload
    const data: EmailData = JSON.parse(payload);
    const { user, email_data } = data;
    const { token, token_hash, redirect_to, email_action_type } = email_data;

    console.log("📧 Processing email verification for:", user.email);

    // Create verification URL
    const verificationUrl = `${redirect_to}?token_hash=${token_hash}&type=${email_action_type}`;
    const fullName = user.user_metadata?.full_name || "Trader";

    // Enhanced email template with clear instructions
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your TradeIQ Account</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 32px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              border: 1px solid #e2e8f0;
            }
            .header {
              text-align: center;
              margin-bottom: 32px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 8px;
            }
            .title {
              color: #1e293b;
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .verify-button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              margin: 24px 0;
              text-align: center;
              transition: background-color 0.3s;
            }
            .verify-button:hover {
              background-color: #1d4ed8;
            }
            .token-box {
              background-color: #f1f5f9;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
              padding: 16px;
              font-family: 'Courier New', monospace;
              font-size: 18px;
              text-align: center;
              margin: 16px 0;
              letter-spacing: 2px;
              color: #1e293b;
            }
            .instructions {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 16px;
              margin: 24px 0;
              border-radius: 0 4px 4px 0;
            }
            .footer {
              margin-top: 32px;
              padding-top: 24px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            .troubleshooting {
              margin-top: 24px;
              background-color: #f8fafc;
              padding: 16px;
              border-radius: 4px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">📈 TradeIQ</div>
              <h1 class="title">Verify Your Email Address</h1>
            </div>
            
            <p>Hello ${fullName},</p>
            
            <p>Thank you for signing up for TradeIQ! To complete your account setup and start using our AI-powered trading platform, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="verify-button">
                Verify My Email Address
              </a>
            </div>
            
            <div class="instructions">
              <strong>📋 Verification Instructions:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Click the blue "Verify My Email Address" button above</li>
                <li>If the button doesn't work, copy and paste the link below directly into your browser</li>
                <li>The verification link will expire in 24 hours for security</li>
                <li>If you don't see this email, check your spam/junk folder</li>
              </ul>
            </div>
            
            <p><strong>Alternative verification link:</strong></p>
            <div style="word-break: break-all; background-color: #f1f5f9; padding: 12px; border-radius: 4px; font-size: 12px; color: #475569;">
              ${verificationUrl}
            </div>
            
            <p><strong>Verification code (if needed):</strong></p>
            <div class="token-box">
              ${token}
            </div>
            
            <div class="troubleshooting">
              <strong>🔧 Troubleshooting:</strong>
              <ul style="margin: 8px 0;">
                <li>If the link doesn't work, try copying and pasting it directly into your browser</li>
                <li>Make sure you're using the same browser you used to sign up</li>
                <li>Clear your browser cache and cookies if the page won't load</li>
                <li>If you continue having issues, contact our support team</li>
                <li>You can also request a new verification link from the login page</li>
              </ul>
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>✅ Access AI-powered trading insights</li>
              <li>✅ Use our advanced chart analysis tools</li>
              <li>✅ Get personalized trading recommendations</li>
              <li>✅ Join our community of traders</li>
            </ul>
            
            <div class="footer">
              <p>If you didn't create a TradeIQ account, you can safely ignore this email.</p>
              <p>This verification link will expire in 24 hours for your security.</p>
              <p>
                <strong>TradeIQ</strong><br>
                AI-Powered Trading Intelligence Platform<br>
                <a href="https://tradeiqpro.com" style="color: #2563eb;">tradeiqpro.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "TradeIQ <noreply@tradeiqpro.com>",
      to: [user.email],
      subject: "🔐 Verify Your TradeIQ Account - Action Required",
      html: htmlContent,
    });

    console.log("📧 Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in email verification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);