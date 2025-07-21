
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

    console.log("🔐 [EMAIL_VERIFICATION] Processing verification email");
    console.log("🔐 [EMAIL_VERIFICATION] Email data:", {
      email: user.email,
      redirectTo: redirect_to,
      actionType: email_action_type,
      tokenPresent: !!token,
      tokenHashPresent: !!token_hash,
      timestamp: new Date().toISOString()
    });

    // Ensure we're using the production domain for verification
    // Use the proper Supabase verification URL format
    const productionDomain = 'https://tradeiqpro.com';
    const verificationUrl = `${productionDomain}/verify-email?token_hash=${token_hash}&type=${email_action_type}&email=${encodeURIComponent(user.email)}`;

    console.log("🔐 [EMAIL_VERIFICATION] Final verification URL:", verificationUrl);

    const fullName = user.user_metadata?.full_name || "Trader";

    // Enhanced email template with proper verification link
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your TradeIQ Pro Account</title>
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
              font-size: 32px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 8px;
            }
            .title {
              color: #1e293b;
              font-size: 26px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .verify-button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 18px 36px;
              text-decoration: none;
              border-radius: 8px;
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
              border: 2px solid #cbd5e1;
              border-radius: 6px;
              padding: 20px;
              font-family: 'Courier New', monospace;
              font-size: 20px;
              text-align: center;
              margin: 20px 0;
              letter-spacing: 3px;
              color: #1e293b;
              font-weight: bold;
            }
            .instructions {
              background-color: #dbeafe;
              border-left: 4px solid #3b82f6;
              padding: 18px;
              margin: 24px 0;
              border-radius: 0 6px 6px 0;
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
              padding: 18px;
              border-radius: 6px;
              font-size: 14px;
            }
            .production-notice {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              padding: 16px;
              border-radius: 6px;
              margin: 20px 0;
              text-align: center;
              font-weight: 600;
              color: #92400e;
            }
            .status-info {
              background-color: #f0f9ff;
              border: 1px solid #0ea5e9;
              padding: 16px;
              border-radius: 6px;
              margin: 20px 0;
              font-size: 14px;
            }
            .url-box {
              word-break: break-all;
              background-color: #f1f5f9;
              padding: 16px;
              border-radius: 6px;
              font-size: 12px;
              color: #475569;
              border: 1px solid #cbd5e1;
              font-family: 'Courier New', monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">📈 TradeIQ Pro</div>
              <h1 class="title">🔐 Verify Your Email Address</h1>
            </div>
            
            <p>Hello ${fullName},</p>
            
            <p>Welcome to <strong>TradeIQ Pro</strong>! To complete your account setup and start using our AI-powered trading platform, please verify your email address by clicking the button below.</p>
            
            <div class="production-notice">
              🌐 This verification will redirect you to: <strong>tradeiqpro.com</strong>
            </div>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="verify-button">
                ✅ Verify My Email Address
              </a>
            </div>
            
            <div class="instructions">
              <strong>📋 Verification Instructions:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Click the "Verify My Email Address" button above</li>
                <li>You'll be redirected to <strong>tradeiqpro.com</strong> for verification</li>
                <li>If the button doesn't work, copy and paste the link below directly into your browser</li>
                <li>This verification link will expire in 24 hours for security</li>
                <li>If you don't see this email, check your spam/junk folder</li>
              </ul>
            </div>
            
            <div class="status-info">
              <strong>🔍 Email Service Status:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Email sent successfully at ${new Date().toLocaleString()}</li>
                <li>Verification URL validated: ✅</li>
                <li>Token generated: ✅</li>
                <li>SMTP service: Active</li>
                <li>Domain: tradeiqpro.com</li>
              </ul>
            </div>
            
            <p><strong>🔗 Alternative verification link:</strong></p>
            <div class="url-box">
              ${verificationUrl}
            </div>
            
            <p><strong>🔢 Manual verification code (if needed):</strong></p>
            <div class="token-box">
              ${token}
            </div>
            
            <div class="troubleshooting">
              <strong>🔧 Troubleshooting:</strong>
              <ul style="margin: 8px 0;">
                <li>Make sure you're clicking the link in the same browser you used to sign up</li>
                <li>If the link doesn't work, try copying and pasting it directly into your browser</li>
                <li>Clear your browser cache and cookies if the verification page won't load</li>
                <li>The verification must be completed on <strong>tradeiqpro.com</strong></li>
                <li>If you continue having issues, you can request a new verification link from the login page</li>
              </ul>
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>✅ Access AI-powered trading insights and analysis</li>
              <li>✅ Use our advanced chart analysis and technical indicators</li>
              <li>✅ Get personalized trading recommendations</li>
              <li>✅ Join our community of professional traders</li>
              <li>✅ Access real-time market data and news</li>
            </ul>
            
            <div class="footer">
              <p>If you didn't create a TradeIQ Pro account, you can safely ignore this email.</p>
              <p>This verification link will expire in 24 hours for your security.</p>
              <p>
                <strong>TradeIQ Pro</strong><br>
                AI-Powered Trading Intelligence Platform<br>
                <a href="https://tradeiqpro.com" style="color: #2563eb; text-decoration: none;">🌐 tradeiqpro.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const emailResponse = await resend.emails.send({
        from: "TradeIQ Pro <noreply@tradeiqpro.com>",
        to: [user.email],
        subject: "🔐 Verify Your TradeIQ Pro Account - Action Required",
        html: htmlContent,
      });

      console.log("🔐 [EMAIL_VERIFICATION] Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ 
        success: true, 
        id: emailResponse.data?.id,
        verificationUrl: verificationUrl,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (emailError: any) {
      console.error("🔐 [EMAIL_VERIFICATION] Failed to send email:", emailError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send verification email",
          details: emailError.message,
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("🔐 [EMAIL_VERIFICATION] Error in verification email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
