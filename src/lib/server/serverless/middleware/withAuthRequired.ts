import { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/services/server/supabase/serverless';
import { response401UnauthorizedError } from '@/lib/server/serverless/http';

type TokenValidationResponse = Awaited<ReturnType<typeof getUser>>;

export type NextApiRequestWithAuthRequired = NextApiRequest & {
  auth: TokenValidationResponse;
};

export const withAuthRequired =
  (
    handler: (
      request: NextApiRequestWithAuthRequired,
      response: NextApiResponse,
    ) => unknown | Promise<unknown>,
  ) =>
  async (request: NextApiRequestWithAuthRequired, response: NextApiResponse) => {
    try {
      // getUser already checks for Authorization header
      const auth = await getUser(request, response);

      if (!auth || !auth.data.user || auth.error) {
        return response401UnauthorizedError(response, 'You must be logged in');
      }

      request.auth = auth;
    } catch (error) {
      console.error('Authentication error:', error);
      return response401UnauthorizedError(response, 'You must be logged in');
    }

    return handler(request, response);
  };
