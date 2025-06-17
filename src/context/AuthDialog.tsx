'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { User } from '@supabase/supabase-js';

type AuthMode = 'login' | 'signup';

interface AuthDialogState {
  isOpen: boolean;
  mode: AuthMode;
  loginTitle?: string;
  loginDescription?: string;
  signupTitle?: string;
  signupDescription?: string;
  onLoginSuccess?: (user: User | null) => Promise<void>;
  onSignupSuccess?: (user: User | null) => Promise<void>;
  useLinks?: boolean; // Whether to use links or toggle buttons
}

interface AuthDialogContextValue extends AuthDialogState {
  openLogin: (options?: Omit<AuthDialogState, 'isOpen' | 'mode'>) => void;
  openSignup: (options?: Omit<AuthDialogState, 'isOpen' | 'mode'>) => void;
  close: () => void;
  toggleMode: () => void;
  // Computed properties
  title: string;
  description?: string;
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

const DEFAULT_TITLES = {
  login: 'Log in to your account',
  signup: 'Create your account',
} as const;

const DEFAULT_DESCRIPTIONS = {
  login: "Enter your email below to log in to your account. We'll send you a code to sign in.",
  signup: "Enter your email below to create your account. We'll send you a code to sign up.",
} as const;

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthDialogState>({
    isOpen: false,
    mode: 'login',
    useLinks: false,
  });

  const openLogin = useCallback((options?: Omit<AuthDialogState, 'isOpen' | 'mode'>) => {
    setState({
      ...options,
      isOpen: true,
      mode: 'login',
    });
  }, []);

  const openSignup = useCallback((options?: Omit<AuthDialogState, 'isOpen' | 'mode'>) => {
    setState({
      ...options,
      isOpen: true,
      mode: 'signup',
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      loginTitle: undefined,
      loginDescription: undefined,
      signupTitle: undefined,
      signupDescription: undefined,
      isOpen: false,
    }));
  }, []);

  const toggleMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mode: prev.mode === 'login' ? 'signup' : 'login',
    }));
  }, []);

  const handleAuthSuccess = async (user: User | null) => {
    if (state.mode === 'login') {
      await state.onLoginSuccess?.(user);
    } else {
      await state.onSignupSuccess?.(user);
    }
    close();
  };

  const title =
    state.mode === 'login'
      ? state.loginTitle || DEFAULT_TITLES.login
      : state.signupTitle || DEFAULT_TITLES.signup;

  const description =
    state.mode === 'login'
      ? state.loginDescription || DEFAULT_DESCRIPTIONS.login
      : state.signupDescription || DEFAULT_DESCRIPTIONS.signup;

  const value = {
    ...state,
    openLogin,
    openSignup,
    close,
    toggleMode,
    onAuthSuccess: handleAuthSuccess,
    title,
    description,
  };

  return <AuthDialogContext.Provider value={value}>{children}</AuthDialogContext.Provider>;
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return context;
}
