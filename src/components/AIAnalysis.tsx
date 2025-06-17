
import { EnhancedAIAnalysis } from './EnhancedAIAnalysis';

interface AIAnalysisProps {
  symbol: string;
  stockData?: {
    price: number;
    change: number;
  };
}

export const AIAnalysis = ({ symbol, stockData }: AIAnalysisProps) => {
  return <EnhancedAIAnalysis symbol={symbol} stockData={stockData} />;
};
