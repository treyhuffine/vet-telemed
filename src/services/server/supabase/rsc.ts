import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { IS_MOCK } from '@/constants/config';

export async function createClient(token?: string) {
  if (IS_MOCK) {
    // Return a mock client for React Server Components
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        admin: {
          updateUserById: async () => ({ data: { user: null }, error: null }),
        },
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    } as any;
  }
  
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      global: {
        // If token is provided, use it for auth (for mobile clients)
        ...(token && { headers: { Authorization: `Bearer ${token}` } }),
      },
    },
  );
}

export const getUser = async (token?: string) => {
  const supabase = await createClient(token);
  return supabase.auth.getUser();
};

export const getSession = async (token?: string) => {
  const supabase = await createClient(token);
  return supabase.auth.getSession();
};

export const updateCreatedAccountMetadata = async (userId: string) => {
  // For admin operations, we use cookies as this is only used from server to server
  const supabase = await createClient();
  return supabase.auth.admin.updateUserById(userId, {
    user_metadata: { created_account: true },
  });
};
