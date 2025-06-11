
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, X } from 'lucide-react';

interface AddAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAlert: (alertData: {
    symbol: string;
    alert_type: 'price' | 'percentage' | 'pattern';
    threshold: number;
    is_active: boolean;
  }) => Promise<boolean>;
  prefilledSymbol?: string;
}

export const AddAlertModal = ({ isOpen, onClose, onAddAlert, prefilledSymbol = '' }: AddAlertModalProps) => {
  const [symbol, setSymbol] = useState(prefilledSymbol);
  const [alertType, setAlertType] = useState<'price' | 'percentage' | 'pattern'>('price');
  const [threshold, setThreshold] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol.trim() || !threshold.trim()) {
      return;
    }

    setLoading(true);
    const success = await onAddAlert({
      symbol: symbol.toUpperCase(),
      alert_type: alertType,
      threshold: parseFloat(threshold),
      is_active: isActive
    });

    if (success) {
      setSymbol('');
      setThreshold('');
      setAlertType('price');
      setIsActive(true);
      onClose();
    }
    setLoading(false);
  };

  const handleClose = () => {
    setSymbol('');
    setThreshold('');
    setAlertType('price');
    setIsActive(true);
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && prefilledSymbol) {
      setSymbol(prefilledSymbol);
    }
  }, [isOpen, prefilledSymbol]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="tradeiq-card max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center space-x-2">
              <Bell className="h-5 w-5 text-tradeiq-blue" />
              <span>Create Alert</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-gray-300">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL, BTC"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertType" className="text-gray-300">Alert Type</Label>
            <Select value={alertType} onValueChange={(value: 'price' | 'percentage' | 'pattern') => setAlertType(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="price">Price Alert</SelectItem>
                <SelectItem value="percentage">Percentage Change</SelectItem>
                <SelectItem value="pattern">Pattern Detection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-gray-300">
              Threshold {alertType === 'percentage' ? '(%)' : alertType === 'price' ? '($)' : ''}
            </Label>
            <Input
              id="threshold"
              type="number"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={alertType === 'percentage' ? '5.0' : '100.00'}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="text-gray-300">Active</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="tradeiq-button-primary flex-1"
              disabled={loading || !symbol.trim() || !threshold.trim()}
            >
              {loading ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
