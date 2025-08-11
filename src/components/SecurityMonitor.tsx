
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Clock, User } from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'profile_update' | 'failed_login';
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export const SecurityMonitor = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Simulate loading recent security events
    // In a real implementation, this would fetch from an audit log
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        timestamp: new Date().toISOString(),
        details: 'Successful login from new device',
        severity: 'low'
      },
      {
        id: '2', 
        type: 'profile_update',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: 'Profile settings updated',
        severity: 'low'
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="h-4 w-4" />;
      case 'failed_login': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Security Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-700 h-16 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No recent security events</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 bg-black/20 rounded-lg">
                  <div className="flex-shrink-0 text-tradeiq-blue mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium capitalize">
                        {event.type.replace('_', ' ')}
                      </p>
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{event.details}</p>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs mt-2">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
