import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/services/server/supabase/edge';
import { response401UnauthorizedError } from '@/lib/server/edge/http';

type TokenValidationResponse = Awaited<ReturnType<typeof getUser>>;

export type NextApiRequestWithAuthRequired = NextRequest & {
  auth: TokenValidationResponse;
};

export const withAuthRequired =
  (
    handler: (
      request: NextApiRequestWithAuthRequired,
      response: NextResponse,
    ) => unknown | Promise<unknown>,
  ) =>
  async (request: NextApiRequestWithAuthRequired, response: NextResponse) => {
    try {
      const auth = await getUser(request, response);

      if (!auth || !auth.data.user || auth.error) {
        return response401UnauthorizedError(request, 'You must be logged in');
      }

      request.auth = auth;
    } catch (error) {
      console.error('Authentication error:', error);
      return response401UnauthorizedError(request, 'You must be logged in');
    }

    return handler(request, response);
  };
