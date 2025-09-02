import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { apiClient, secureStorage } from "@/lib/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const useLogin = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        return response;
      } catch (error: any) {
        // Check if it's a 401 unauthorized error
        if (error.message.includes('401')) {
          throw new Error('Invalid email or password');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      // Store the token securely
      secureStorage.setToken(data.token);
      
      // Show success toast
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      
      // Navigate to home page
      navigate('/');
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};