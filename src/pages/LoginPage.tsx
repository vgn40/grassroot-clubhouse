import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, AlertCircle, Trophy, Users } from 'lucide-react';
import { useLogin } from '@/hooks/useLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading } = useLogin();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    login({ email: email.trim(), password, rememberMe });
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google OAuth implementation
    console.log('Google Sign-in clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left side - Illustration/Brand */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-accent rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-primary shadow-sm mb-8">
              <Trophy className="h-4 w-4" />
              Fan Platform
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Manage your club with<br />
              <span className="text-primary">passion</span> and <span className="text-accent">precision</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Connect with your community, organize activities, and create unforgettable sports experiences.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Club Management</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>Activity Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-sm">
            {/* Mobile brand header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                <Trophy className="h-4 w-4" />
                Fan Platform
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back
              </h1>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <div className="hidden lg:block">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                    <Trophy className="h-4 w-4" />
                    Fan Platform
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Sign in to your account
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors(prev => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder="Enter your email"
                      className={`focus-enhanced h-11 ${errors.email ? 'border-destructive error-shake' : ''}`}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-2 text-sm text-destructive" role="alert">
                        <AlertCircle className="h-4 w-4" />
                        <span id="email-error">{errors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      placeholder="Enter your password"
                      className={`focus-enhanced h-11 ${errors.password ? 'border-destructive error-shake' : ''}`}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <div className="flex items-center gap-2 text-sm text-destructive" role="alert">
                        <AlertCircle className="h-4 w-4" />
                        <span id="password-error">{errors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                        disabled={isLoading}
                        className="focus-enhanced"
                      />
                      <Label 
                        htmlFor="remember" 
                        className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 focus-enhanced rounded"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 btn-primary focus-enhanced"
                    disabled={isLoading || !email.trim() || !password.trim()}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                {/* Continue with Google */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium focus-enhanced"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Google
                </Button>

                {/* Sign Up Link */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-primary font-medium hover:text-primary/80 focus-enhanced rounded"
                  >
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}