
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, Camera, Loader, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSectionProps {
  user: User;
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
}

export const ProfileSection = ({ user, userProfile, onProfileUpdate }: ProfileSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setUsername(userProfile.username || '');
    }
  }, [userProfile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([fileName]);

      if (deleteError && deleteError.message !== 'The resource was not found') {
        console.error('Error deleting old avatar:', deleteError);
      }

      // Upload new avatar
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        toast({
          title: "Upload failed",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update or insert user profile with new avatar URL
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: publicUrl,
          email: user.email 
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating profile with avatar URL:', error);
        toast({
          title: "Profile update failed",
          description: "Avatar uploaded but failed to update profile.",
          variant: "destructive",
        });
        return;
      }

      onProfileUpdate(data);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const updates = {
        id: user.id,
        full_name: fullName.trim(),
        username: username.trim() || null,
        email: user.email,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
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
              <AvatarImage 
                src={userProfile?.avatar_url} 
                alt="Profile picture"
              />
              <AvatarFallback className="bg-tradeiq-blue text-white text-lg font-semibold">
                {fullName ? getInitials(fullName) : getInitials(user?.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-tradeiq-navy bg-black/80 hover:bg-black/60"
            >
              {isUploadingAvatar ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-white font-medium">{fullName || 'Set your name'}</h3>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="text-tradeiq-blue hover:text-blue-400 p-0 h-auto mt-1"
            >
              <Upload className="h-3 w-3 mr-1" />
              {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
            </Button>
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
              placeholder={t('placeholders.enterFullName')}
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
              placeholder={t('placeholders.chooseUsername')}
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
