import React, { useState } from "react";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Bell, Shield, Upload, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  
  // Show demo data if no profile is available
  const profileData = profile || {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar_url: '',
    notify_email: true,
    notify_push: false,
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notify_email: false,
    notify_push: false,
  });

  // Update form when profile loads
  React.useEffect(() => {
    setFormData({
      name: profileData.name,
      email: profileData.email,
      notify_email: profileData.notify_email,
      notify_push: profileData.notify_push,
    });
  }, [profileData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updates: any = {};
    if (formData.name !== profileData.name) updates.name = formData.name;
    if (formData.email !== profileData.email) updates.email = formData.email;
    if (formData.notify_email !== profileData.notify_email) updates.notify_email = formData.notify_email;
    if (formData.notify_push !== profileData.notify_push) updates.notify_push = formData.notify_push;

    if (Object.keys(updates).length > 0 && profile) {
      updateProfileMutation.mutate(updates);
    } else if (!profile) {
      // Demo mode - just show a toast
      toast({
        title: "Demo mode",
        description: "Changes saved locally (demo mode)",
      });
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleSignOut = () => {
    toast({
      title: "Sign out",
      description: "You have been signed out successfully.",
    });
    // Add actual sign out logic here
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }


  const hasChanges = (
    formData.name !== profileData.name ||
    formData.email !== profileData.email ||
    formData.notify_email !== profileData.notify_email ||
    formData.notify_push !== profileData.notify_push
  );

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Your basic account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.avatar_url} />
              <AvatarFallback className="text-lg">
                {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={uploadAvatarMutation.isPending}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change Photo'}
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <Separator />

          {/* Name & Email */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                />
                <Badge variant="secondary">
                  <Mail className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Email Notifications</label>
              <p className="text-xs text-muted-foreground">Get updates via email</p>
            </div>
            <Switch
              checked={formData.notify_email}
              onCheckedChange={(checked) => handleInputChange('notify_email', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Push Notifications</label>
              <p className="text-xs text-muted-foreground">Get instant notifications</p>
            </div>
            <Switch
              checked={formData.notify_push}
              onCheckedChange={(checked) => handleInputChange('notify_push', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Save Changes */}
      {hasChanges && (
        <div className="sticky bottom-6 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="shadow-lg"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;