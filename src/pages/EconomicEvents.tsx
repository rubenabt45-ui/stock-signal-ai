
import React from "react";
import { Calendar, Clock, Globe, TrendingUp, MessageSquare, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEconomicEvents } from "@/hooks/useEconomicEvents";

const EconomicEvents = () => {
  const { events, loading, error, lastUpdate, fromCache, refreshEvents } = useEconomicEvents();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours >= 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleSendToChat = (event: any) => {
    const eventDate = new Date(event.datetime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const prompt = `How will the upcoming ${event.title} on ${eventDate} affect the market?`;
    
    navigate('/trading-chat', { 
      state: { 
        prompt: prompt,
        eventContext: {
          title: event.title,
          date: eventDate,
          region: event.region,
          impact: event.impact
        }
      } 
    });

    toast({
      title: "Sent to Chat",
      description: `Question about ${event.title} sent to StrategyAI`,
    });
  };

  const handleRefresh = async () => {
    toast({
      title: "Refreshing Events",
      description: "Fetching latest economic events...",
    });
    await refreshEvents();
  };

  const getTimeUntilEvent = (datetime: string) => {
    const now = new Date();
    const eventDate = new Date(datetime);
    const diffMs = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Past event";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy">
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-tradeiq-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Economic Events</h1>
                  <p className="text-sm text-gray-400 font-medium">Key macroeconomic events for traders</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6 pb-24">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="tradeiq-card animate-pulse">
                <CardHeader className="pb-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/3"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Economic Events</h1>
                <p className="text-sm text-gray-400 font-medium">High-impact macroeconomic events</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-tradeiq-blue/50 text-tradeiq-blue hover:bg-tradeiq-blue/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-6 p-3 bg-gray-900/50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            {fromCache ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            <span>
              {lastUpdate ? `Updated ${formatLastUpdate(lastUpdate)}` : 'No data available'}
              {fromCache && ' (cached)'}
            </span>
          </div>
          <Badge variant="outline" className="text-tradeiq-blue border-tradeiq-blue/30">
            {events.length} high-impact events
          </Badge>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="tradeiq-card mb-6 border-yellow-500/30">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">API Warning</span>
              </div>
              <p className="text-sm text-gray-300 mt-2">{error}</p>
              {fromCache && (
                <p className="text-xs text-gray-400 mt-1">Showing cached data from previous fetch.</p>
              )}
            </CardHeader>
          </Card>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <Card className="tradeiq-card">
            <CardHeader className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-white mb-2">No Major Events Today</h3>
              <p className="text-gray-400">No high-impact economic events found for today and upcoming days. Check back tomorrow.</p>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <Card key={index} className="tradeiq-card hover:bg-gray-800/30 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{event.title}</h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDateTime(event.datetime)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>{event.region}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getImpactColor(event.impact)}`}>
                            {event.impact} Impact
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                            {getTimeUntilEvent(event.datetime)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>Market impact analysis available</span>
                    </div>
                    
                    <Button
                      onClick={() => handleSendToChat(event)}
                      variant="outline"
                      size="sm"
                      className="border-tradeiq-blue/50 text-tradeiq-blue hover:bg-tradeiq-blue/10"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send to Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EconomicEvents;
