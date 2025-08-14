import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Loader, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const LogoutSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <Card className="tradeiq-card border-red-500/20">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <LogOut className="h-5 w-5 text-red-500" />
          <CardTitle className="text-white">Account Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showConfirmation ? (
          <>
            <div className="space-y-2">
              <p className="text-white font-medium">Sign Out</p>
              <p className="text-gray-400 text-sm">
                Sign out of your TradeIQ account. Your data and preferences will be saved.
              </p>
            </div>
            <Button
              onClick={handleLogoutClick}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Confirm Sign Out</p>
                <p className="text-gray-400 text-sm">
                  Are you sure you want to sign out of your account?
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleCancelLogout}
                variant="outline"
                className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLogout}
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
