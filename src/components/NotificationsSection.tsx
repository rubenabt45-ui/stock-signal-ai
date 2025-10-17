
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bell, Edit3, Trash2, Plus, Volume2, Mail, Settings } from 'lucide-react';
import { useUserAlerts, UserAlert } from '@/hooks/useUserAlerts';
import { AddAlertModal } from '@/components/AddAlertModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const NotificationsSection = () => {
  const { alerts, loading, addAlert, updateAlert, deleteAlert } = useUserAlerts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ threshold: string; alert_type: string }>({ threshold: '', alert_type: '' });
  
  // Global notification preferences
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('alerts_enabled, sound_enabled, email_alerts_enabled')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading preferences:', error);
        } else if (data) {
          setAlertsEnabled(data.alerts_enabled ?? true);
          setSoundEnabled(data.sound_enabled ?? true);
          setEmailAlertsEnabled(data.email_alerts_enabled ?? false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreference = async (field: string, value: boolean) => {
    if (!user) return;

    setPreferencesLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating preference:', error);
        toast({
          title: "Error",
          description: "Failed to update preference",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Preferences Updated",
          description: "Your notification preferences have been saved",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update preference",
        variant: "destructive",
      });
    }
    setPreferencesLoading(false);
  };

  const handleEditAlert = (alert: UserAlert) => {
    setEditingAlert(alert.id);
    setEditValues({
      threshold: alert.threshold.toString(),
      alert_type: alert.alert_type
    });
  };

  const handleSaveEdit = async (alertId: string) => {
    const success = await updateAlert(alertId, {
      threshold: parseFloat(editValues.threshold),
      alert_type: editValues.alert_type as 'price' | 'percentage' | 'pattern'
    });

    if (success) {
      setEditingAlert(null);
    }
  };

  const handleToggleAlert = async (alert: UserAlert) => {
    await updateAlert(alert.id, { is_active: !alert.is_active });
  };

  const formatAlertType = (type: string) => {
    switch (type) {
      case 'price': return 'Price';
      case 'percentage': return 'Percentage';
      case 'pattern': return 'Pattern';
      default: return type;
    }
  };

  const formatThreshold = (threshold: number, type: string) => {
    switch (type) {
      case 'price': return `$${threshold}`;
      case 'percentage': return `${threshold}%`;
      default: return threshold.toString();
    }
  };

  if (loading) {
    return (
      <Card className="tradeiq-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Bell className="h-5 w-5 text-tradeiq-blue" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="tradeiq-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Bell className="h-5 w-5 text-tradeiq-blue" />
              <span>Notifications</span>
            </CardTitle>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              className="tradeiq-button-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Preferences */}
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Global Preferences</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Enable Alerts</p>
                    <p className="text-gray-400 text-sm">Turn on/off all price alerts</p>
                  </div>
                </div>
                <Switch
                  checked={alertsEnabled}
                  onCheckedChange={(checked) => {
                    setAlertsEnabled(checked);
                    updatePreference('alerts_enabled', checked);
                  }}
                  disabled={preferencesLoading}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Sound Notifications</p>
                    <p className="text-gray-400 text-sm">Play sound when alerts trigger</p>
                  </div>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={(checked) => {
                    setSoundEnabled(checked);
                    updatePreference('sound_enabled', checked);
                  }}
                  disabled={preferencesLoading}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Email Alerts</p>
                    <p className="text-gray-400 text-sm">Send alerts to your email (Pro feature)</p>
                  </div>
                </div>
                <Switch
                  checked={emailAlertsEnabled}
                  onCheckedChange={(checked) => {
                    setEmailAlertsEnabled(checked);
                    updatePreference('email_alerts_enabled', checked);
                  }}
                  disabled={preferencesLoading}
                />
              </div>
            </div>
          </div>

          {/* User Alerts Table */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Your Alerts</h4>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No alerts yet</p>
                <p className="text-sm mb-4">Create your first alert to get notified about price changes</p>
                <Button onClick={() => setIsAddModalOpen(true)} className="tradeiq-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </div>
            ) : (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Symbol</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Threshold</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{alert.symbol}</TableCell>
                        <TableCell>
                          {editingAlert === alert.id ? (
                            <Select
                              value={editValues.alert_type}
                              onValueChange={(value) => setEditValues(prev => ({ ...prev, alert_type: value }))}
                            >
                              <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="price">Price</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="pattern">Pattern</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-gray-300">{formatAlertType(alert.alert_type)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingAlert === alert.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editValues.threshold}
                              onChange={(e) => setEditValues(prev => ({ ...prev, threshold: e.target.value }))}
                              className="w-24 bg-gray-800 border-gray-600 text-white"
                            />
                          ) : (
                            <span className="text-gray-300">{formatThreshold(alert.threshold, alert.alert_type)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={alert.is_active ? "default" : "secondary"}>
                            {alert.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingAlert === alert.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(alert.id)}
                                  className="tradeiq-button-primary"
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingAlert(null)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditAlert(alert)}
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Switch
                                  checked={alert.is_active}
                                  onCheckedChange={() => handleToggleAlert(alert)}
                                />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteAlert(alert.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddAlertModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAlert={addAlert}
      />
    </>
  );
};
