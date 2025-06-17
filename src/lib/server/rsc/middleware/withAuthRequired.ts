import { getUser } from '@/services/server/supabase/rsc';
import { response401UnauthorizedError } from '@/lib/server/rsc/http';

type TokenValidationResponse = Awaited<ReturnType<typeof getUser>>;

export type RequestWithAuth = Request & {
  auth: TokenValidationResponse;
};

// Extract authorization token from Request object
const getAuthToken = (request: Request): string | undefined => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
};

export const withAuthRequired = (handler: (request: RequestWithAuth) => Promise<Response>) => {
  return async (request: Request) => {
    try {
      // First try to get auth from cookie (web flow)
      let auth = await getUser();

      // If no user found via cookies, check for Authorization header (mobile flow)
      if (!auth?.data?.user || auth.error) {
        const token = getAuthToken(request);
        if (token) {
          auth = await getUser(token);
        }
      }

      if (!auth || !auth.data.user || auth.error) {
        return response401UnauthorizedError('You must be logged in');
      }

      (request as RequestWithAuth).auth = auth;

      return handler(request as RequestWithAuth);
    } catch (error) {
      console.error('Authentication error:', error);
      return response401UnauthorizedError('You must be logged in');
    }
  };
};
