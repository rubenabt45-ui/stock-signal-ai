
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeSelect: (timeframe: string) => void;
}

const timeframes = [
  { value: "1D", label: "1D", interval: "5min", description: "5-minute intervals" },
  { value: "1W", label: "1W", interval: "daily", description: "Daily intervals" },
  { value: "1M", label: "1M", interval: "daily", description: "Daily intervals" },
  { value: "3M", label: "3M", interval: "weekly", description: "Weekly intervals" },
  { value: "6M", label: "6M", interval: "weekly", description: "Weekly intervals" },
  { value: "1Y", label: "1Y", interval: "monthly", description: "Monthly intervals" },
];

export const TimeframeSelector = ({ selectedTimeframe, onTimeframeSelect }: TimeframeSelectorProps) => {
  const handleTimeframeClick = (timeframeValue: string) => {
    console.log(`🕒 Timeframe selected: ${timeframeValue} (triggering immediate update)`);
    onTimeframeSelect(timeframeValue);
  };

  return (
    <Card className="tradeiq-card p-4 rounded-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-5 w-5 text-tradeiq-blue" />
        <span className="text-white font-semibold">Timeframe</span>
        <span className="text-xs text-gray-400">
          Current: {timeframes.find(t => t.value === selectedTimeframe)?.description || 'Unknown'}
        </span>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => handleTimeframeClick(timeframe.value)}
            className={`px-4 py-2 rounded-xl font-semibold min-w-[60px] transition-all duration-200 ${
              selectedTimeframe === timeframe.value
                ? 'bg-tradeiq-blue text-white shadow-lg scale-105'
                : 'bg-black/30 text-gray-400 hover:bg-black/50 hover:text-white hover:scale-105'
            }`}
            title={`Switch to ${timeframe.label} view (${timeframe.description})`}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </Card>
  );
};
