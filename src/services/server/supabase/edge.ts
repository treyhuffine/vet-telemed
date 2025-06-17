import { createServerClient } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';

// Extract authorization token from request headers
export const getAuthHeader = (request: NextRequest): string | undefined => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
};

export const createClient = (request: NextRequest, response: NextResponse, token?: string) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
      global: {
        // If token is provided, use it for auth (for mobile clients)
        ...(token && { headers: { Authorization: `Bearer ${token}` } }),
      },
    },
  );

  return supabase;
};

export const getUser = async (request: NextRequest, response: NextResponse) => {
  // Check for Authorization header (mobile clients)
  const token = getAuthHeader(request);

  // Create client with token if available
  const supabase = createClient(request, response, token);
  return supabase.auth.getUser();
};

export const getSession = async (request: NextRequest, response: NextResponse) => {
  // Check for Authorization header (mobile clients)
  const token = getAuthHeader(request);

  // Create client with token if available
  const supabase = createClient(request, response, token);
  return supabase.auth.getSession();
};
