
export interface HostCheckResult {
  ok: boolean;
  reason?: string;
  host?: string;
}

export async function checkSupabaseHost(url: string): Promise<HostCheckResult> {
  try {
    if (!url) {
      return { ok: false, reason: 'no_url_provided' };
    }

    const urlObj = new URL(url);
    const host = urlObj.hostname;

    // Call Google DNS API to check if host resolves
    const dnsUrl = `https://dns.google/resolve?name=${host}&type=A`;
    
    try {
      const response = await fetch(dnsUrl);
      const data = await response.json();
      
      // Check if DNS resolution was successful (Status === 0) and has A records
      const hasValidRecords = data.Status === 0 && data.Answer && data.Answer.length > 0;
      
      if (!hasValidRecords) {
        return { 
          ok: false, 
          reason: 'dns_nxdomain',
          host 
        };
      }
      
      return { ok: true, host };
    } catch (dnsError) {
      console.error('DNS check failed:', dnsError);
      return { 
        ok: false, 
        reason: 'dns_query_failed',
        host 
      };
    }
  } catch (error) {
    console.error('Host check error:', error);
    return { 
      ok: false, 
      reason: 'invalid_url' 
    };
  }
}
