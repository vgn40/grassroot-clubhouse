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
    <AppLayout>
      <div className="min-h-screen bg-gradient-soft">
        <div className="container max-w-4xl mx-auto p-6 space-y-8">
          {/* ... keep existing code */}
        </div>
      </div>
    </AppLayout>
  );
};

export default ClubSettingsPage;