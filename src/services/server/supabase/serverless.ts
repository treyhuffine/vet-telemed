import { createServerClient, serializeCookieHeader } from '@supabase/ssr';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { IS_MOCK } from '@/constants/config';

// Extract authorization token from request headers
export const getAuthHeader = (req: NextApiRequest): string | undefined => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
};

export function createClient(req: NextApiRequest, res: NextApiResponse, token?: string) {
  if (IS_MOCK) {
    // Return a mock client for serverless functions
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    } as any;
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || '' }));
        },
        setAll(cookiesToSet) {
          res.setHeader(
            'Set-Cookie',
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      },
      global: {
        // If token is provided, use it for auth (for mobile clients)
        ...(token && { headers: { Authorization: `Bearer ${token}` } }),
      },
    },
  );

  return supabase;
}

export const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check for Authorization header (mobile clients)
  const token = getAuthHeader(req);

  // Create client with token if available
  const supabase = createClient(req, res, token);
  return supabase.auth.getUser();
};

export const getSession = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check for Authorization header (mobile clients)
  const token = getAuthHeader(req);

  // Create client with token if available
  const supabase = createClient(req, res, token);
  return supabase.auth.getSession();
};
