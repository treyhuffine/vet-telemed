import { Preferences } from '@capacitor/preferences';
import { createBrowserClient as createBrowserClientSsr } from '@supabase/ssr';
import {
  SupabaseClient,
  VerifyEmailOtpParams,
  createClient as createBrowserClient,
} from '@supabase/supabase-js';
import { IS_MOCK } from '@/constants/config';

type CreateClient = SupabaseClient<any, 'public', any>;
let browserClient: CreateClient | undefined;

// Mock client for when IS_MOCK is true
const createMockClient = (): any => {
  return {
    auth: {
      signInWithOtp: async () => ({ data: { user: null }, error: null }),
      verifyOtp: async () => ({ data: { user: null, session: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      refreshSession: async () => ({ data: { session: null }, error: null }),
      signInWithOAuth: async () => ({ data: { provider: null, url: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        // Return a mock subscription object
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  };
};

export const createClient: () => CreateClient = () => {
  if (IS_MOCK) {
    return createMockClient() as CreateClient;
  }
  if (process.env.TARGET_PLATFORM === 'mobile') {
    if (browserClient) {
      return browserClient;
    }

    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: {
            async getItem(key) {
              const result = await Preferences.get({ key });
              return result.value ?? null;
            },
            async setItem(key, value) {
              await Preferences.set({ key, value });
            },
            async removeItem(key) {
              await Preferences.remove({ key });
            },
          },
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      },
    );
    return browserClient;
  }

  return createBrowserClientSsr(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};

// if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
// }
// if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
// }

// Accounts that will use password auth instead of OTP
export const PASSWORD_AUTH_EMAILS = [
  'apple-reviewer@dynamism.app',
  'android-reviewer@dynamism.app',
  'reviewer+apple@dynamism.app',
  'reviewer+android@dynamism.app',
];

// Utility to check if an email should use password authentication
export const isPasswordAccount = (email: string): boolean => {
  return PASSWORD_AUTH_EMAILS.includes(email.toLowerCase());
};

export const signInWithOtp = async (email: string) => {
  if (IS_MOCK) {
    return { data: { user: null }, error: null };
  }
  const client = createClient();
  return client.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${window.location.origin}/verify-otp?email=${encodeURIComponent(email)}`,
      data: {
        email_verified: false,
        // is_email_verified_by_app: false,
      },
    },
  });
};

export async function verifyOtpEmail({ token, email }: Omit<VerifyEmailOtpParams, 'type'>) {
  if (IS_MOCK) {
    return { data: { user: null, session: null }, error: null };
  }
  const supabase = createClient();
  return supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
}

// Auth helpers
// DATA FROM RESPONSE
// {
//   "user": {
//       "id": "00a14ca0-15b8-47ec-b077-8370d4b31c39",
//       "aud": "authenticated",
//       "role": "authenticated",
//       "email": "treyhuffine+supa1@gmail.com",
//       "phone": "",
//       "confirmation_sent_at": "2025-01-20T19:32:40.882044371Z",
//       "app_metadata": {
//           "provider": "email",
//           "providers": [
//               "email"
//           ]
//       },
//       "user_metadata": {
//           "email": "treyhuffine+supa1@gmail.com",
//           "email_verified": false,
//           "phone_verified": false,
//           "sub": "00a14ca0-15b8-47ec-b077-8370d4b31c39"
//       },
//       "identities": [
//           {
//               "identity_id": "37d50b7c-aa77-497c-9530-7f8b5806f932",
//               "id": "00a14ca0-15b8-47ec-b077-8370d4b31c39",
//               "user_id": "00a14ca0-15b8-47ec-b077-8370d4b31c39",
//               "identity_data": {
//                   "email": "treyhuffine+supa1@gmail.com",
//                   "email_verified": false,
//                   "phone_verified": false,
//                   "sub": "00a14ca0-15b8-47ec-b077-8370d4b31c39"
//               },
//               "provider": "email",
//               "last_sign_in_at": "2025-01-20T19:32:40.859788852Z",
//               "created_at": "2025-01-20T19:32:40.859852Z",
//               "updated_at": "2025-01-20T19:32:40.859852Z",
//               "email": "treyhuffine+supa1@gmail.com"
//           }
//       ],
//       "created_at": "2025-01-20T19:32:40.815495Z",
//       "updated_at": "2025-01-20T19:32:41.564531Z",
//       "is_anonymous": false
//   },
//   "session": null
// }
export const signUpWithPassword = async (email: string, password: string) => {
  if (IS_MOCK) {
    return { data: { user: null, session: null }, error: null };
  }
  const client = createClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        email_verified: false, // explicitly set initial verification status
        // is_email_verified_by_app: false,
      },
    },
  });
  return { data, error };
};

export const logInWithPassword = async (email: string, password: string) => {
  if (IS_MOCK) {
    return { data: { user: null, session: null }, error: null };
  }
  const client = createClient();
  // First check if user exists, if not create it
  const { data: userCheckData, error: checkError } = await client.auth.signInWithPassword({
    email,
    password,
  });

  // If user doesn't exist or incorrect password, try to create the account
  if (checkError && checkError.status === 400 && isPasswordAccount(email)) {
    const { data, error: signUpError } = await signUpWithPassword(email, password);
    if (signUpError) {
      return { error: signUpError };
    }
    return { data };
  }

  return { data: userCheckData, error: checkError };
};

export const signOut = async () => {
  if (IS_MOCK) {
    return { error: null };
  }
  const client = createClient();
  return client.auth.signOut();
};

export const resetPassword = async (email: string) => {
  if (IS_MOCK) {
    return { data: null, error: null };
  }
  const client = createClient();
  return client.auth.resetPasswordForEmail(email);
};

export const updatePassword = async (newPassword: string) => {
  if (IS_MOCK) {
    return { data: { user: null }, error: null };
  }
  const client = createClient();
  return client.auth.updateUser({
    password: newPassword,
  });
};

export const getViewerToken = async () => {
  if (IS_MOCK) {
    return null;
  }
  const client = createClient();
  const {
    data: { session },
  } = await client.auth.getSession();

  if (!session) return null;

  // Check if token is about to expire (e.g., within next 2 minutes)
  const expiresAt = session.expires_at; // Unix timestamp in seconds
  const isExpiringSoon = (expiresAt || 0) * 1000 - Date.now() < 2 * 60 * 1000;

  if (isExpiringSoon) {
    // Manually trigger a refresh
    const {
      data: { session: newSession },
    } = await client.auth.refreshSession();
    return newSession?.access_token || null;
  }

  return session.access_token;
};

export enum AuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
}

const PROVIDER_SCOPES = {
  [AuthProvider.GOOGLE]: 'email profile',
  [AuthProvider.APPLE]: 'name email',
  [AuthProvider.FACEBOOK]: 'email,public_profile',
} as const;

// Base OAuth function (can be made private by removing export)
export const signInWithOAuth = async (provider: AuthProvider) => {
  if (IS_MOCK) {
    return { data: { provider: null, url: null }, error: null };
  }
  const client = createClient();
  return client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: PROVIDER_SCOPES[provider],
      queryParams: {
        access_type: 'offline',
      },
    },
  });
};

// Provider-specific functions
export const signInWithGoogle = async () => {
  return signInWithOAuth(AuthProvider.GOOGLE);
};

export const signInWithApple = async () => {
  return signInWithOAuth(AuthProvider.APPLE);
};

export const signInWithFacebook = async () => {
  return signInWithOAuth(AuthProvider.FACEBOOK);
};
