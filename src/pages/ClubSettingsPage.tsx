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
import { AppLayout } from "@/components/Layout/AppLayout";
import { toast } from "@/hooks/use-toast";

const ClubSettingsPage = () => {
  const { id: clubId } = useParams<{ id: string }>();
  const { data: settings, isLoading, error } = useClubSettings(clubId!);
  const updateSettingsMutation = useUpdateClubSettings(clubId!);
  const uploadLogoMutation = useUploadClubLogo(clubId!);
  
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
    if (settings) {
      setFormData({
        name: settings.name,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color || '#0EA5E9',
        deadline_hours: settings.rsvp_defaults.deadline_hours,
        visibility: settings.rsvp_defaults.visibility,
        auto_reminders: settings.rsvp_defaults.auto_reminders,
        reminder_hours: settings.rsvp_defaults.reminder_hours,
      });
    } else {
      // Set demo data when no settings are available
      setFormData({
        name: 'Demo Sports Club',
        primary_color: '#1F4ED8',
        secondary_color: '#0EA5E9',
        deadline_hours: 24,
        visibility: 'members' as 'members' | 'public',
        auto_reminders: true,
        reminder_hours: 2,
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!settings) {
      // Demo mode - just show a toast
      toast({
        title: "Demo mode",
        description: "Changes saved locally (demo mode)",
      });
      return;
    }

    const updates: any = {};
    if (formData.name !== settings.name) updates.name = formData.name;
    if (formData.primary_color !== settings.primary_color) updates.primary_color = formData.primary_color;
    if (formData.secondary_color !== (settings.secondary_color || '#0EA5E9')) updates.secondary_color = formData.secondary_color;
    
    const rsvpUpdates: any = {};
    if (formData.deadline_hours !== settings.rsvp_defaults.deadline_hours) rsvpUpdates.deadline_hours = formData.deadline_hours;
    if (formData.visibility !== settings.rsvp_defaults.visibility) rsvpUpdates.visibility = formData.visibility;
    if (formData.auto_reminders !== settings.rsvp_defaults.auto_reminders) rsvpUpdates.auto_reminders = formData.auto_reminders;
    if (formData.reminder_hours !== settings.rsvp_defaults.reminder_hours) rsvpUpdates.reminder_hours = formData.reminder_hours;
    
    if (Object.keys(rsvpUpdates).length > 0) {
      updates.rsvp_defaults = rsvpUpdates;
    }

    if (Object.keys(updates).length > 0) {
      updateSettingsMutation.mutate(updates);
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
      <AppLayout>
        <div className="container max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }


  const hasChanges = settings ? (
    formData.name !== settings.name ||
    formData.primary_color !== settings.primary_color ||
    formData.secondary_color !== (settings.secondary_color || '#0EA5E9') ||
    formData.deadline_hours !== settings.rsvp_defaults.deadline_hours ||
    formData.visibility !== settings.rsvp_defaults.visibility ||
    formData.auto_reminders !== settings.rsvp_defaults.auto_reminders ||
    formData.reminder_hours !== settings.rsvp_defaults.reminder_hours
  ) : false;

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Club Settings</h1>
              <p className="text-muted-foreground">Manage your club preferences and branding</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateSettingsMutation.isPending}
              className="ml-auto"
            >
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Settings className="h-5 w-5" />
                  General
                </CardTitle>
                <CardDescription>
                  Basic information about your club
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={settings?.logo_url} />
                      <AvatarFallback className="text-lg">
                        {formData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-1">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="h-8 px-3" asChild>
                          <span>
                            <Upload className="h-3 w-3 mr-1" />
                            Upload Logo
                          </span>
                        </Button>
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={!canEdit}
                      />
                      <span className="text-xs text-muted-foreground">Max 5MB</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="club-name" className="text-sm font-medium">
                      Club Name
                    </label>
                    <Input
                      id="club-name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!canEdit}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Branding Settings */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Palette className="h-5 w-5" />
                  Branding
                </CardTitle>
                <CardDescription>
                  Customize your club's visual identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="primary-color" className="text-sm font-medium">
                      Primary Color
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        disabled={!isAdmin}
                        className="w-12 h-10 p-1 border"
                      />
                      <Input
                        value={formData.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        disabled={!isAdmin}
                        className="flex-1"
                        placeholder="#1F4ED8"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="secondary-color" className="text-sm font-medium">
                      Secondary Color
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        disabled={!isAdmin}
                        className="w-12 h-10 p-1 border"
                      />
                      <Input
                        value={formData.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        disabled={!isAdmin}
                        className="flex-1"
                        placeholder="#0EA5E9"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <div 
                    className="p-4 rounded-lg text-white"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    <h3 className="font-bold text-lg">{formData.name}</h3>
                    <p className="opacity-90">Activity Hero Preview</p>
                    <div 
                      className="mt-2 px-3 py-1 rounded text-sm inline-block"
                      style={{ backgroundColor: formData.secondary_color }}
                    >
                      Event Badge
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event & RSVP Defaults */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Users className="h-5 w-5" />
                  Event & RSVP Defaults
                </CardTitle>
                <CardDescription>
                  Default settings for new events and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rsvp-deadline" className="text-sm font-medium">
                      RSVP Deadline
                    </label>
                    <Select
                      value={String(formData.deadline_hours)}
                      onValueChange={(value) => handleInputChange('deadline_hours', Number(value))}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="rsvp-deadline" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 hours before</SelectItem>
                        <SelectItem value="6">6 hours before</SelectItem>
                        <SelectItem value="12">12 hours before</SelectItem>
                        <SelectItem value="24">1 day before</SelectItem>
                        <SelectItem value="48">2 days before</SelectItem>
                        <SelectItem value="72">3 days before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="default-visibility" className="text-sm font-medium">
                      Default Visibility
                    </label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value: 'members' | 'public') => handleInputChange('visibility', value)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="default-visibility" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="members">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Members only
                          </div>
                        </SelectItem>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Public
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="auto-reminders" className="text-sm font-medium">
                        Auto Reminders
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Automatically send reminder emails to participants
                      </p>
                    </div>
                    <Switch
                      id="auto-reminders"
                      checked={formData.auto_reminders}
                      onCheckedChange={(checked) => handleInputChange('auto_reminders', checked)}
                      disabled={!canEdit}
                    />
                  </div>

                  {formData.auto_reminders && (
                    <div>
                      <label htmlFor="reminder-timing" className="text-sm font-medium">
                        Reminder Timing
                      </label>
                      <Select
                        value={String(formData.reminder_hours)}
                        onValueChange={(value) => handleInputChange('reminder_hours', Number(value))}
                        disabled={!canEdit}
                      >
                        <SelectTrigger id="reminder-timing" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              1 hour before
                            </div>
                          </SelectItem>
                          <SelectItem value="2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              2 hours before
                            </div>
                          </SelectItem>
                          <SelectItem value="6">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              6 hours before
                            </div>
                          </SelectItem>
                          <SelectItem value="24">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              1 day before
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClubSettingsPage;