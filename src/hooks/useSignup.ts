import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { apiClient, secureStorage } from "@/lib/api";

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const useSignup = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (credentials: SignupCredentials): Promise<SignupResponse> => {
      try {
        const { confirmPassword, ...signupData } = credentials;
        const response = await apiClient.post('/auth/signup', signupData);
        return response;
      } catch (error: any) {
        // Check if it's a 409 conflict error (email already exists)
        if (error.message.includes('409')) {
          throw new Error('An account with this email already exists');
        }
        // Check if it's a 422 validation error
        if (error.message.includes('422')) {
          throw new Error('Please check your information and try again');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      // Store the token securely
      secureStorage.setToken(data.token);
      
      // Show success toast
      toast({
        title: "Account created!",
        description: "Welcome to Fan Platform! Your account has been created successfully.",
      });
      
      // Navigate to home page
      navigate('/');
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    signup: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};