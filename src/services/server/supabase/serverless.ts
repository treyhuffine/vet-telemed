import { createServerClient, serializeCookieHeader } from '@supabase/ssr';
import { type NextApiRequest, type NextApiResponse } from 'next';

// Extract authorization token from request headers
export const getAuthHeader = (req: NextApiRequest): string | undefined => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
};

export function createClient(req: NextApiRequest, res: NextApiResponse, token?: string) {
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
