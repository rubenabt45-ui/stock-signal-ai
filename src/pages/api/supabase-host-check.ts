
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    
    if (!envUrl) {
      return res.status(500).json({ 
        error: 'NEXT_PUBLIC_SUPABASE_URL not configured',
        envUrl: null,
        host: null,
        dnsOk: false 
      });
    }

    // Parse hostname from the URL
    const url = new URL(envUrl);
    const host = url.hostname;

    // Check DNS resolution using Google's DNS API
    const dnsUrl = `https://dns.google/resolve?name=${host}&type=A`;
    
    let dnsOk = false;
    try {
      const dnsResponse = await fetch(dnsUrl);
      const dnsData = await dnsResponse.json();
      
      // Check if DNS resolution was successful (Status === 0) and has A records
      dnsOk = dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0;
    } catch (dnsError) {
      console.error('DNS check failed:', dnsError);
      dnsOk = false;
    }

    return res.json({
      envUrl,
      host,
      dnsOk
    });
  } catch (error: any) {
    console.error('Supabase host check error:', error);
    return res.status(500).json({
      error: error.message,
      envUrl: null,
      host: null,
      dnsOk: false
    });
  }
}
