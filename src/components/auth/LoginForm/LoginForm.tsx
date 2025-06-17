'use client';

import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { AlertCircle } from 'lucide-react';
import { isPasswordAccount, logInWithPassword, signInWithOtp } from '@/services/client/supabase';
import { cn } from '@/lib/utils';
import { useRequestStatus } from '@/hooks/useRequestStatus';
import { OtpVerificationForm } from '@/components/auth/OtpVerificationForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps extends React.ComponentPropsWithoutRef<'form'> {
  onSuccess?: (user: User | null) => Promise<any>;
  onToggleMode: () => void;
  formTitleNode?: React.ReactNode;
}

export function LoginForm({
  className,
  onSuccess,
  onToggleMode,
  formTitleNode,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { isLoading, setLoading, error, setError, setSuccess } = useRequestStatus();
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
      const { error: signInError } = await signInWithOtp(email);

      if (signInError) {
        throw signInError;
      }

      setSuccess();
      setShowOtpForm(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading();

    try {
      const { error: signInError, data } = await logInWithPassword(email, password);

      if (signInError) {
        throw signInError;
      }

      setSuccess();
      if (data?.user) {
        onSuccess?.(data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
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
              {isLoading ? 'Logging in...' : 'Log in'}
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
        {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button> */}
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="font-semibold underline underline-offset-4"
            onClick={onToggleMode}
          >
            Sign up
          </button>
        </div>
      </form>
    </>
  );
}
