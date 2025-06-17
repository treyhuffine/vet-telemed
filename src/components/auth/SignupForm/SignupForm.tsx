'use client';

import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { AlertCircle } from 'lucide-react';
import {
  isPasswordAccount,
  logInWithPassword,
  signInWithOtp,
  signUpWithPassword,
} from '@/services/client/supabase';
import { cn } from '@/lib/utils';
import { useRequestStatus } from '@/hooks/useRequestStatus';
import { OtpVerificationForm } from '@/components/auth/OtpVerificationForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupFormProps extends React.ComponentPropsWithoutRef<'form'> {
  onSuccess?: (user?: User | null) => Promise<any> | void;
  onToggleMode: () => void;
  formTitleNode?: React.ReactNode;
}

export function SignupForm({
  className,
  onSuccess,
  onToggleMode,
  formTitleNode,
  ...props
}: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { isLoading, error, setLoading, setError, setSuccess } = useRequestStatus();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (showPassword) {
      passwordInputRef.current?.focus();
    }
  }, [showPassword]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isPasswordAccount(email)) {
      setShowPassword(true);
      return;
    }

    setLoading();

    try {
      const { error: signUpError } = await signInWithOtp(email);

      if (signUpError) {
        throw signUpError;
      }

      setSuccess();
      setShowOtpForm(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading();

    try {
      const { error: signUpError, data } = await signUpWithPassword(email, password);

      if (signUpError) {
        // If account already exists, try to sign in
        if (signUpError.message.includes('already exists')) {
          const { error: signInError, data: signInData } = await logInWithPassword(email, password);
          if (signInError) {
            throw signInError;
          }
          setSuccess();
          if (signInData?.user) {
            onSuccess?.(signInData.user);
          }
          return;
        }
        throw signUpError;
      }

      setSuccess();
      if (data?.user) {
        onSuccess?.(data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  const handleOtpSuccess = async (user: User | null) => {
    try {
      onSuccess?.(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify user');
    }
  };

  if (showOtpForm) {
    return (
      <OtpVerificationForm
        email={email}
        onBack={() => setShowOtpForm(false)}
        onSuccess={handleOtpSuccess}
        className={className}
      />
    );
  }

  if (showPassword) {
    return (
      <>
        {formTitleNode}
        <form
          onSubmit={handlePasswordSubmit}
          className={cn('flex flex-col gap-6', className)}
          {...props}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                ref={passwordInputRef}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowPassword(false);
                setPassword('');
                setError('');
              }}
              disabled={isLoading}
            >
              Back
            </Button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      {formTitleNode}
      <form
        onSubmit={handleEmailSubmit}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              ref={emailInputRef}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending code...' : 'Send Code'}
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <button
            type="button"
            className="font-semibold underline underline-offset-4"
            onClick={onToggleMode}
          >
            Log in
          </button>
        </div>
      </form>
    </>
  );
}
