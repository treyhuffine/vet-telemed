'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { User } from '@supabase/supabase-js';
import { AlertCircle } from 'lucide-react';
import {
  API_PATH,
  PostRequestPayload,
  PostResponsePayload,
} from '@/constants/payloads/auth/exists';
import { useSetUserFullNameMutation } from '@/types/generated/client/hooks';
import { verifyOtpEmail } from '@/services/client/supabase';
import { cn } from '@/lib/utils';
import { useApiGateway } from '@/hooks/useApi';
import { usePollForUser } from '@/hooks/usePollForUser';
import { useRequestStatus } from '@/hooks/useRequestStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props extends React.ComponentPropsWithoutRef<'form'> {
  email: string;
  onBack?: () => void;
  onSuccess?: (user: User | null) => Promise<any>;
  shouldSkipUserPoll?: boolean;
}

export function OtpVerificationForm({ className, email, onBack, onSuccess, ...props }: Props) {
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const inputRefs = useRef(
    Array(6)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>()),
  );
  const { isLoading, error, setLoading, setError, setSuccess } = useRequestStatus();
  const checkEmailApi = useApiGateway<PostRequestPayload, PostResponsePayload>(API_PATH);
  const [setUserFullNameMutation] = useSetUserFullNameMutation();
  const pollForUser = usePollForUser();

  useEffect(() => {
    const checkUserExists = async () => {
      const response = await checkEmailApi.post({
        payload: { email },
      });

      if (!response.isError && typeof response.data === 'object') {
        setIsExistingUser(response.data.doesExist);
      } else {
        // Default to not showing name field if we can't determine status
        setIsExistingUser(true);
      }
    };

    checkUserExists();
  }, [email]);

  // Add useEffect for auto-focus
  useEffect(() => {
    // Short timeout to ensure the input is mounted
    setTimeout(() => {
      inputRefs.current[0]?.current?.focus();
    }, 50);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = otp.split('');
    newOtp[index] = value;
    const newOtpString = newOtp.join('');
    setOtp(newOtpString);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.current?.focus();
    }

    // Auto-submit when the last digit is entered and all digits are filled
    if (index === 5 && value && newOtpString.length === 6) {
      // Use the new OTP string directly instead of depending on state
      setTimeout(() => {
        handleSubmitWithOtp(newOtpString);
      }, 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    setOtp(pastedData);

    // Focus last input or the next empty input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.current?.focus();
  };

  const handleSubmitWithOtp = async (otpValue: string) => {
    if (!isExistingUser && !name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading();

    try {
      const { error: verificationError, data: verificationData } = await verifyOtpEmail({
        email,
        token: otpValue,
      });

      if (verificationError) {
        throw verificationError;
      }

      await pollForUser(verificationData?.user);

      if (onSuccess) {
        await onSuccess(verificationData?.user);
      }

      if (!isExistingUser) {
        await setUserFullNameMutation({
          variables: {
            id: verificationData?.user?.id,
            name: name.trim(),
          },
        });
      }

      setSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithOtp(otp);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Enter verification code</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the verification code we sent to <span className="font-medium">{email}</span>
        </p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6">
        {isExistingUser === false && (
          <div className="grid gap-2">
            <Label htmlFor="full-name">Your Name</Label>
            <Input
              id="full-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              disabled={isLoading}
              autoComplete="name"
              required
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="otp-0">Verification Code</Label>
          <div className="flex justify-center gap-2">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Input
                  key={index}
                  ref={inputRefs.current[index]}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={otp[index] || ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading || checkEmailApi.isLoading}
                  className="h-12 w-12 text-center text-lg"
                />
              ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || checkEmailApi.isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
          disabled={isLoading || checkEmailApi.isLoading}
        >
          Use a different email
        </Button>
      </div>
    </form>
  );
}
