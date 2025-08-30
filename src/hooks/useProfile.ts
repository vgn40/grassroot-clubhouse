import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  notify_email: boolean;
  notify_push: boolean;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
  avatar_url?: string;
  notify_email?: boolean;
  notify_push?: boolean;
}

const fetchProfile = async (): Promise<Profile> => {
  const response = await fetch('/api/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
};

const updateProfile = async (updates: ProfileUpdate): Promise<Profile> => {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
};

const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/uploads/avatar', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload avatar');
  }
  return response.json();
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      
      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<Profile>(['profile']);
      
      // Optimistically update
      if (previousProfile) {
        queryClient.setQueryData(['profile'], { ...previousProfile, ...updates });
      }
      
      return { previousProfile };
    },
    onError: (err, updates, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile);
      }
      toast({
        title: "Error updating profile",
        description: "Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      // Update profile with new avatar URL
      const currentProfile = queryClient.getQueryData<Profile>(['profile']);
      if (currentProfile) {
        queryClient.setQueryData(['profile'], { ...currentProfile, avatar_url: data.url });
      }
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    },
  });
};