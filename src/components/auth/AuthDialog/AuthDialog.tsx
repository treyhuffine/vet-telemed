'use client';

import { useAuthDialog } from '@/context/AuthDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoginForm } from '../LoginForm';
import { SignupForm } from '../SignupForm';

export interface AuthDialogProps {
  className?: string;
}

export function AuthDialog({ className }: AuthDialogProps) {
  const { isOpen, close, mode, title, description, onLoginSuccess, onSignupSuccess, toggleMode } =
    useAuthDialog();

  const handleLoginSuccess = async (user: any) => {
    try {
      if (onLoginSuccess) {
        await onLoginSuccess(user ?? null);
      }
    } finally {
      close();
    }
  };

  const handleSignupSuccess = async (user: any) => {
    try {
      if (onSignupSuccess) {
        await onSignupSuccess(user ?? null);
      }
    } finally {
      close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {mode === 'login' ? (
          <LoginForm onSuccess={handleLoginSuccess} onToggleMode={toggleMode} />
        ) : (
          <SignupForm onSuccess={handleSignupSuccess} onToggleMode={toggleMode} />
        )}
      </DialogContent>
    </Dialog>
  );
}
