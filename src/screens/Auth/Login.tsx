'use client';

import { useState } from 'react';
import { Loader2, Stethoscope, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useVetAuth } from '@/context/VetAuth';
import { quickLoginPresets } from '@/constants/mockAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user } = useVetAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Dashboard will handle role-based routing
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login for demo
  const quickLogin = async (preset: typeof quickLoginPresets[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setValidationErrors({});
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(preset.email, preset.password);
      
      if (result.success) {
        // Dashboard will handle role-based routing
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <div className="order-2 lg:order-1">
            {/* Logo and Title */}
            <div className="mb-8 text-center lg:text-left">
              <div className="mb-4 flex justify-center lg:justify-start">
                <div className="rounded-full bg-primary p-3">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Emergency Vet Portal</h1>
              <p className="mt-2 text-gray-600">Connect pets with care in under 10 minutes</p>
            </div>

            {/* Login Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationErrors({ ...validationErrors, email: undefined });
                      }}
                      className={`mt-1 ${validationErrors.email ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setValidationErrors({ ...validationErrors, password: undefined });
                        }}
                        className={`mt-1 pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact your clinic administrator
              </p>
            </div>
          </div>

          {/* Quick Login Section */}
          <div className="order-1 lg:order-2">
            <Card className="border-2 border-blue-100 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-xl">Demo Quick Access</CardTitle>
                <CardDescription>
                  Click any persona below to instantly log in and explore the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLoginPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => quickLogin(preset)}
                    disabled={isLoading}
                    className="w-full text-left p-4 rounded-lg border bg-white hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{preset.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{preset.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{preset.subtitle}</p>
                        <p className="text-xs text-gray-500">{preset.description}</p>
                        <div className="mt-2 flex gap-3 text-xs text-gray-400">
                          <span>Email: {preset.email}</span>
                          <span>Pass: {preset.password}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                <Alert className="mt-4">
                  <AlertDescription className="text-xs">
                    <strong>Note:</strong> This is a demo environment. No real patient data is stored or transmitted. All data is mock data for demonstration purposes only.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}