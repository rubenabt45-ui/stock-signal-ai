
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, Camera, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSectionProps {
  user: User;
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
}

export const ProfileSection = ({ user, userProfile, onProfileUpdate }: ProfileSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setUsername(userProfile.username || '');
    }
  }, [userProfile]);

  const handleSaveChanges = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const updates = {
        id: user.id,
        full_name: fullName.trim(),
        username: username.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(updates)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Update failed",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      onProfileUpdate(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <UserIcon className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">Profile</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-tradeiq-blue text-white text-lg font-semibold">
                {fullName ? getInitials(fullName) : getInitials(user?.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-tradeiq-navy bg-black/80 hover:bg-black/60"
              disabled
            >
              <Camera className="h-3 w-3" />
            </Button>
          </div>
          <div>
            <h3 className="text-white font-medium">{fullName || 'Set your name'}</h3>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-800/50 border-gray-700 text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username (optional)"
              className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-tradeiq-blue"
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
