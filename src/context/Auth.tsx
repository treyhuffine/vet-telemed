'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { AuthError, User } from '@supabase/supabase-js';
import { AuthState } from '@/constants/auth';
import { GetViewerByIdQuery, useGetViewerByIdQuery } from '@/types/generated/client/hooks';
import { identify } from '@/services/client/analytics';
import { createClient } from '@/services/client/supabase';
import { IS_MOCK } from '@/constants/config';

interface AuthContextType {
  userId?: string | null;
  session: {
    user: User | null;
    loading: boolean;
    error: AuthError | null;
  };
  viewerQuery: ReturnType<typeof useGetViewerByIdQuery> | null;
  viewer: GetViewerByIdQuery['usersByPk'] | null;
  authState: AuthState;
  isEmailVerified: boolean;
  isEmailVerifiedByApp: boolean;
  isReady: boolean;
  isAnonymous: boolean;
  isUser: boolean;
  isViewerLoading: boolean;
  isViewerCalled: boolean;
  viewerError?: ApolloError | undefined;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  viewerQuery: null,
  viewer: null,
  isViewerLoading: false,
  isViewerCalled: false,
  session: {
    user: null,
    loading: true,
    error: null,
  },
  authState: AuthState.Loading,
  isEmailVerified: false,
  isEmailVerifiedByApp: false,
  isReady: false,
  isAnonymous: false,
  isUser: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [hasIdentifiedUser, setHasIdentifiedUser] = useState(false);
  const userId = user?.id;

  const viewerQuery = useGetViewerByIdQuery({
    variables: {
      id: userId,
    },
    skip: !userId,
  });

  useEffect(() => {
    // Skip Supabase auth in mock mode
    if (IS_MOCK) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    const supabase = createClient();

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data, error }) => {
      const session = data?.session;
      if (error) setError(error);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && viewerQuery.data?.usersByPk && !hasIdentifiedUser) {
      setHasIdentifiedUser(true);
      try {
        const viewer = viewerQuery.data.usersByPk;
        identify({
          email: user.email,
          name: viewer.name,
          userId: user.id,
          additionalUserParams: {
            ...viewer,
          },
        });
      } catch (error) {
        console.error('Error identifying user:', error);
      }
    }
  }, [user, viewerQuery.data, hasIdentifiedUser]);

  const authState = isLoading ? AuthState.Loading : user ? AuthState.User : AuthState.Anonymous;
  const viewer = viewerQuery.data?.usersByPk;

  return (
    <AuthContext.Provider
      value={{
        userId: user?.id,
        viewer: viewer,
        isViewerLoading: viewerQuery.loading,
        isViewerCalled: viewerQuery.called,
        viewerError: viewerQuery.error,
        session: {
          user: user,
          loading: isLoading,
          error: error,
        },
        viewerQuery: viewerQuery,
        authState,
        isReady: authState !== AuthState.Loading,
        isAnonymous: authState === AuthState.Anonymous,
        isUser: authState === AuthState.User,
        isEmailVerified: !!user?.user_metadata?.email_verified,
        isEmailVerifiedByApp: !!user?.user_metadata?.is_email_verified_by_app,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
