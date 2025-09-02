// Simple preview component for LoginPage (Storybook alternative)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Create wrapper with providers for preview
const PreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Simple preview component for development
export const LoginPagePreview = () => (
  <PreviewWrapper>
    <LoginPage />
  </PreviewWrapper>
);

export default LoginPagePreview;