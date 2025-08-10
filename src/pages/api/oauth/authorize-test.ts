
// Optional OAuth authorization test endpoint
export default async function handler(req: any, res: any) {
  try {
    const { provider = 'google', redirect } = req.query;
    
    if (!['google', 'github'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider. Use google or github' });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xnrvqfclyroagzknedhs.supabase.co';
    const origin = req.headers.origin || 'http://localhost:3000';
    const defaultRedirect = `${origin}/auth/callback`;
    const redirectTo = redirect || defaultRedirect;
    
    const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
    
    console.log('[OAuth:authorize-test]', { provider, redirectTo, authUrl });
    
    try {
      const response = await fetch(authUrl, { 
        method: 'GET', 
        redirect: 'manual' 
      });
      
      const result = {
        status: response.status,
        location: response.headers.get('location') || null,
        url: authUrl,
        provider,
        redirectTo,
        timestamp: new Date().toISOString()
      };
      
      console.log('[OAuth:authorize-test] Result:', result);
      
      return res.json(result);
    } catch (fetchError: any) {
      console.error('[OAuth:authorize-test] Fetch error:', fetchError);
      return res.status(500).json({
        error: fetchError.message,
        url: authUrl,
        provider,
        redirectTo
      });
    }
  } catch (error: any) {
    console.error('[OAuth:authorize-test] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
