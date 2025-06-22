
import { memo } from "react";
import { useTradingViewData } from "@/contexts/TradingViewDataContext";
import { TradingViewWidget } from "@/components/TradingViewWidget";

interface TradingViewAdvancedChartProps {
  symbol: string;
  timeframe: string;
  height?: string;
  className?: string;
}

const TradingViewAdvancedChartComponent = ({ 
  symbol, 
  timeframe, 
  height = "600px", 
  className = "" 
}: TradingViewAdvancedChartProps) => {
  const { updateData } = useTradingViewData();

  const handlePriceUpdate = (priceData: {
    price: number;
    changePercent: number;
    high: number;
    low: number;
    volume?: number;
    lastUpdated: number;
  }) => {
    updateData(symbol, {
      price: priceData.price,
      changePercent: priceData.changePercent,
      high: priceData.high,
      low: priceData.low,
      volume: priceData.volume || null,
      lastUpdated: priceData.lastUpdated
    });
  };

  return (
    <TradingViewWidget
      symbol={symbol}
      timeframe={timeframe}
      onPriceUpdate={handlePriceUpdate}
      height={height}
      className={className}
    />
  );
};

export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent, (prevProps, nextProps) => {
  const shouldNotRerender = 
    prevProps.symbol === nextProps.symbol &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className;
  
  if (!shouldNotRerender) {
    console.log(`🔄 Chart re-rendering: ${prevProps.symbol} → ${nextProps.symbol}, ${prevProps.timeframe} → ${nextProps.timeframe}`);
  }
  
  return shouldNotRerender;
});
