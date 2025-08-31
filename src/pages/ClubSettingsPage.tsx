import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useClubSettings, useUpdateClubSettings, useUploadClubLogo } from "@/hooks/useClubSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Palette, Users, Upload, Eye, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ClubSettingsPage = () => {
  const { id: clubId } = useParams<{ id: string }>();
  const { data: settings, isLoading, error } = useClubSettings(clubId!);
  const updateSettingsMutation = useUpdateClubSettings(clubId!);
  const uploadLogoMutation = useUploadClubLogo(clubId!);
  
  // Show demo data if no settings are available
  const settingsData = settings || {
    id: clubId || 'demo-club',
    name: 'Demo Sports Club',
    logo_url: '',
    primary_color: '#1F4ED8',
    secondary_color: '#0EA5E9',
    rsvp_defaults: {
      deadline_hours: 24,
      visibility: 'members' as const,
      auto_reminders: true,
      reminder_hours: 2,
    },
  };
  
  // Mock user role - in real app this would come from auth context
  const userRole = "admin"; // "admin" | "træner" | "medlem"
  const canEdit = userRole === "admin" || userRole === "træner";
  const isAdmin = userRole === "admin";
  
  const [formData, setFormData] = useState({
    name: '',
    primary_color: '#1F4ED8',
    secondary_color: '#0EA5E9',
    deadline_hours: 24,
    visibility: 'members' as 'members' | 'public',
    auto_reminders: true,
    reminder_hours: 2,
  });

  React.useEffect(() => {
    setFormData({
      name: settingsData.name,
      primary_color: settingsData.primary_color,
      secondary_color: settingsData.secondary_color || '#0EA5E9',
      deadline_hours: settingsData.rsvp_defaults.deadline_hours,
      visibility: settingsData.rsvp_defaults.visibility,
      auto_reminders: settingsData.rsvp_defaults.auto_reminders,
      reminder_hours: settingsData.rsvp_defaults.reminder_hours,
    });
  }, [settingsData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updates: any = {};
    if (formData.name !== settingsData.name) updates.name = formData.name;
    if (formData.primary_color !== settingsData.primary_color) updates.primary_color = formData.primary_color;
    if (formData.secondary_color !== settingsData.secondary_color) updates.secondary_color = formData.secondary_color;
    
    const rsvpUpdates: any = {};
    if (formData.deadline_hours !== settingsData.rsvp_defaults.deadline_hours) rsvpUpdates.deadline_hours = formData.deadline_hours;
    if (formData.visibility !== settingsData.rsvp_defaults.visibility) rsvpUpdates.visibility = formData.visibility;
    if (formData.auto_reminders !== settingsData.rsvp_defaults.auto_reminders) rsvpUpdates.auto_reminders = formData.auto_reminders;
    if (formData.reminder_hours !== settingsData.rsvp_defaults.reminder_hours) rsvpUpdates.reminder_hours = formData.reminder_hours;
    
    if (Object.keys(rsvpUpdates).length > 0) {
      updates.rsvp_defaults = rsvpUpdates;
    }

    if (Object.keys(updates).length > 0 && settings) {
      updateSettingsMutation.mutate(updates);
    } else if (!settings) {
      // Demo mode - just show a toast
      toast({
        title: "Demo mode",
        description: "Changes saved locally (demo mode)",
      });
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      uploadLogoMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }


  const hasChanges = (
    formData.name !== settingsData.name ||
    formData.primary_color !== settingsData.primary_color ||
    formData.secondary_color !== settingsData.secondary_color ||
    formData.deadline_hours !== settingsData.rsvp_defaults.deadline_hours ||
    formData.visibility !== settingsData.rsvp_defaults.visibility ||
    formData.auto_reminders !== settingsData.rsvp_defaults.auto_reminders ||
    formData.reminder_hours !== settingsData.rsvp_defaults.reminder_hours
  );

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Club Settings</h1>
          <p className="text-muted-foreground">
            Manage your club configuration and branding
          </p>
        </div>
        <Badge variant={canEdit ? "default" : "secondary"}>
          {userRole === "admin" ? "Administrator" : userRole === "træner" ? "Coach" : "Member"}
        </Badge>
      </div>

      {!canEdit && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-amber-800 text-sm">
              <Eye className="h-4 w-4 inline mr-2" />
              You're viewing in read-only mode. Contact an administrator to make changes.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>Basic club information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={settingsData.logo_url} />
                <AvatarFallback className="text-lg">
                  {settingsData.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!canEdit || uploadLogoMutation.isPending}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadLogoMutation.isPending ? 'Uploading...' : 'Change Logo'}
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Club Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter club name"
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding
            </CardTitle>
            <CardDescription>Colors and visual identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    disabled={!isAdmin}
                    className="h-10 w-16 rounded border border-input disabled:opacity-50"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    disabled={!isAdmin}
                    placeholder="#1F4ED8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    disabled={!isAdmin}
                    className="h-10 w-16 rounded border border-input disabled:opacity-50"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    disabled={!isAdmin}
                    placeholder="#0EA5E9"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div 
                className="h-20 rounded-lg p-4 flex items-center justify-center text-white font-medium"
                style={{ 
                  background: `linear-gradient(135deg, ${formData.primary_color}, ${formData.secondary_color})` 
                }}
              >
                Activity Hero Preview
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RSVP & Event Defaults */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Event & RSVP Defaults
            </CardTitle>
            <CardDescription>Default settings for new events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">RSVP Deadline</label>
                <Select
                  value={formData.deadline_hours.toString()}
                  onValueChange={(value) => handleInputChange('deadline_hours', parseInt(value))}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours before</SelectItem>
                    <SelectItem value="6">6 hours before</SelectItem>
                    <SelectItem value="12">12 hours before</SelectItem>
                    <SelectItem value="24">1 day before</SelectItem>
                    <SelectItem value="48">2 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Visibility</label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: 'members' | 'public') => handleInputChange('visibility', value)}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="members">Members only</SelectItem>
                    <SelectItem value="public">Public (with link)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Auto Reminders
                  </label>
                  <p className="text-xs text-muted-foreground">Send automatic RSVP reminders</p>
                </div>
                <Switch
                  checked={formData.auto_reminders}
                  onCheckedChange={(checked) => handleInputChange('auto_reminders', checked)}
                  disabled={!canEdit}
                />
              </div>

              {formData.auto_reminders && (
                <div className="space-y-2 ml-6">
                  <label className="text-sm font-medium">Reminder Timing</label>
                  <Select
                    value={formData.reminder_hours.toString()}
                    onValueChange={(value) => handleInputChange('reminder_hours', parseInt(value))}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour before</SelectItem>
                      <SelectItem value="2">2 hours before</SelectItem>
                      <SelectItem value="6">6 hours before</SelectItem>
                      <SelectItem value="24">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Changes */}
      {canEdit && hasChanges && (
        <div className="sticky bottom-6 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="shadow-lg"
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClubSettingsPage;