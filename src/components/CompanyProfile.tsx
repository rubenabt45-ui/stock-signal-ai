import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CompanyProfileProps {
  asset: string;
}

export const CompanyProfile = ({ asset }: CompanyProfileProps) => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Mock company data - in production this would come from an API
  const companyData: Record<string, any> = {
    'AAPL': {
      name: 'Apple Inc.',
      website: 'apple.com',
      employees: '164K',
      isin: 'US0378331005',
      figi: 'BBG000B9XRY4',
      description: 'Apple, Inc. engages in the design, manufacture, and sale of smartphones, personal computers, tablets, wearables and accessories, and other variety of related services. It operates through the following geographical segments: Americas, Europe, Greater China, Japan, and Rest of Asia Pacific.'
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      website: 'microsoft.com',
      employees: '221K',
      isin: 'US5949181045',
      figi: 'BBG000BPH459',
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments.'
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      website: 'abc.xyz',
      employees: '182K',
      isin: 'US02079K3059',
      figi: 'BBG009S39JX6',
      description: 'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.'
    },
    'TSLA': {
      name: 'Tesla, Inc.',
      website: 'tesla.com',
      employees: '127K',
      isin: 'US88160R1014',
      figi: 'BBG000N9MNX3',
      description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally. The company operates in two segments, Automotive, and Energy Generation and Storage.'
    },
    'NVDA': {
      name: 'NVIDIA Corporation',
      website: 'nvidia.com',
      employees: '29K',
      isin: 'US67066G1040',
      figi: 'BBG000BBJQV0',
      description: 'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally. The company operates in two segments, Graphics and Compute & Networking.'
    }
  };

  const symbolKey = asset.replace('NASDAQ:', '').replace('NYSE:', '');
  const profile = companyData[symbolKey] || {
    name: `${symbolKey} Corporation`,
    website: `${symbolKey.toLowerCase()}.com`,
    employees: 'N/A',
    isin: 'N/A',
    figi: 'N/A',
    description: 'Company profile information not available for this symbol.'
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card className="tradeiq-card flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{symbolKey}</div>
            <CardTitle className="text-white">Profile</CardTitle>
          </div>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {/* Website */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
          <span className="text-xs text-gray-500">Website</span>
          <a 
            href={`https://${profile.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-tradeiq-blue hover:text-tradeiq-blue/80 flex items-center gap-1 transition-colors"
          >
            {profile.website}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Employees */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
          <span className="text-xs text-gray-500">Employees (FY)</span>
          <span className="text-xs text-white font-medium">{profile.employees}</span>
        </div>

        {/* ISIN */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
          <span className="text-xs text-gray-500">ISIN</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white font-mono">{profile.isin}</span>
            <button
              onClick={() => handleCopy(profile.isin, 'ISIN')}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy ISIN"
            >
              <Copy className={`h-3 w-3 ${copiedField === 'ISIN' ? 'text-green-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* FIGI */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
          <span className="text-xs text-gray-500">FIGI</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white font-mono">{profile.figi}</span>
            <button
              onClick={() => handleCopy(profile.figi, 'FIGI')}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy FIGI"
            >
              <Copy className={`h-3 w-3 ${copiedField === 'FIGI' ? 'text-green-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="pt-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            {profile.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};