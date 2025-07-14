'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { validateEmail } from '@/lib/error-handling';
import { safeAsync } from '@/lib/error-handling';

export default function PasswordResetScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      validateEmail(email);
    } catch (err: any) {
      setError(err.message);
      return;
    }

    await safeAsync(async () => {
      setIsLoading(true);
      
      // In production, this would call Supabase auth
      // await supabase.auth.resetPasswordForEmail(email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('verify');
      setIsLoading(false);
    }, {
      onError: () => setIsLoading(false),
    });
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    await safeAsync(async () => {
      setIsLoading(true);
      
      // In production, verify the code
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept code "123456"
      if (code === '123456') {
        setStep('reset');
      } else {
        setError('Invalid code. Please try again.');
      }
      
      setIsLoading(false);
    }, {
      onError: () => setIsLoading(false),
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    await safeAsync(async () => {
      setIsLoading(true);
      
      // In production, this would update the password
      // await supabase.auth.updateUser({ password: newPassword })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
      setIsLoading(false);
    }, {
      onError: () => setIsLoading(false),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">EmergencyVet</h1>
          </div>
          <p className="text-gray-600">Emergency Veterinary Telemedicine</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'request' && 'Reset Password'}
              {step === 'verify' && 'Verify Code'}
              {step === 'reset' && 'Create New Password'}
            </CardTitle>
            <CardDescription>
              {step === 'request' && 'Enter your email to receive a password reset code'}
              {step === 'verify' && 'We sent a 6-digit code to your email'}
              {step === 'reset' && 'Choose a strong password for your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Password Reset Successful!</h3>
                <p className="text-gray-600">Redirecting to login...</p>
              </div>
            ) : (
              <>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Step 1: Request Reset */}
                {step === 'request' && (
                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@clinic.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Code'}
                    </Button>
                  </form>
                )}

                {/* Step 2: Verify Code */}
                {step === 'verify' && (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>
                        We sent a verification code to <strong>{email}</strong>
                      </AlertDescription>
                    </Alert>

                    <div>
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        className="text-center text-2xl tracking-wider"
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Enter the 6-digit code from your email
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setStep('request')}
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}