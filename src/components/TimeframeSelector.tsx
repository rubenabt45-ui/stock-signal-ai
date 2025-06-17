
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeSelect: (timeframe: string) => void;
}

const timeframes = [
  { value: "1D", label: "1D", interval: "5min" },
  { value: "1W", label: "1W", interval: "daily" },
  { value: "1M", label: "1M", interval: "daily" },
  { value: "3M", label: "3M", interval: "weekly" },
  { value: "6M", label: "6M", interval: "weekly" },
  { value: "1Y", label: "1Y", interval: "monthly" },
];

export const TimeframeSelector = ({ selectedTimeframe, onTimeframeSelect }: TimeframeSelectorProps) => {
  const handleTimeframeClick = (timeframeValue: string) => {
    console.log(`🕒 Timeframe selected: ${timeframeValue} (switching chart data)`);
    onTimeframeSelect(timeframeValue);
  };

  return (
    <Card className="tradeiq-card p-4 rounded-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-5 w-5 text-tradeiq-blue" />
        <span className="text-white font-semibold">Timeframe</span>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => handleTimeframeClick(timeframe.value)}
            disabled={selectedTimeframe === timeframe.value}
            className={`px-4 py-2 rounded-xl font-semibold min-w-[60px] transition-all duration-200 ${
              selectedTimeframe === timeframe.value
                ? 'bg-tradeiq-blue text-white shadow-lg cursor-default'
                : 'bg-black/30 text-gray-400 hover:bg-black/50 hover:text-white cursor-pointer hover:scale-105'
            }`}
            title={`Switch to ${timeframe.label} view (${timeframe.interval} intervals)`}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </Card>
  );
};
