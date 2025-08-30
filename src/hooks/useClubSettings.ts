import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export interface ClubSettings {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color?: string;
  rsvp_defaults: {
    deadline_hours: number;
    visibility: 'members' | 'public';
    auto_reminders: boolean;
    reminder_hours: number;
  };
}

export interface ClubSettingsUpdate {
  name?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  rsvp_defaults?: Partial<ClubSettings['rsvp_defaults']>;
}

const fetchClubSettings = async (clubId: string): Promise<ClubSettings> => {
  const response = await fetch(`/api/clubs/${clubId}/settings`);
  if (!response.ok) {
    throw new Error('Failed to fetch club settings');
  }
  return response.json();
};

const updateClubSettings = async (clubId: string, updates: ClubSettingsUpdate): Promise<ClubSettings> => {
  const response = await fetch(`/api/clubs/${clubId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update club settings');
  }
  return response.json();
};

const uploadClubLogo = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/uploads/club-logo', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload club logo');
  }
  return response.json();
};

export const useClubSettings = (clubId: string) => {
  return useQuery({
    queryKey: ['clubSettings', clubId],
    queryFn: () => fetchClubSettings(clubId),
    enabled: !!clubId,
  });
};

export const useUpdateClubSettings = (clubId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: ClubSettingsUpdate) => updateClubSettings(clubId, updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['clubSettings', clubId] });
      
      const previousSettings = queryClient.getQueryData<ClubSettings>(['clubSettings', clubId]);
      
      if (previousSettings) {
        queryClient.setQueryData(['clubSettings', clubId], { 
          ...previousSettings, 
          ...updates,
          rsvp_defaults: updates.rsvp_defaults 
            ? { ...previousSettings.rsvp_defaults, ...updates.rsvp_defaults }
            : previousSettings.rsvp_defaults
        });
      }
      
      return { previousSettings };
    },
    onError: (err, updates, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(['clubSettings', clubId], context.previousSettings);
      }
      toast({
        title: "Error updating settings",
        description: "Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Club settings have been saved successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clubSettings', clubId] });
    },
  });
};

export const useUploadClubLogo = (clubId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadClubLogo,
    onSuccess: (data) => {
      const currentSettings = queryClient.getQueryData<ClubSettings>(['clubSettings', clubId]);
      if (currentSettings) {
        queryClient.setQueryData(['clubSettings', clubId], { ...currentSettings, logo_url: data.url });
      }
      toast({
        title: "Logo uploaded",
        description: "Club logo has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    },
  });
};