import { NextApiRequest, NextApiResponse } from 'next';
import { GetViewerByIdQuery } from '@/types/generated/server';
import { getViewerById } from '@/services/server/graphql/queries/getViewerById';
import { getUser } from '@/services/server/supabase/serverless';
import { response401UnauthorizedError } from '@/lib/server/serverless/http';

type TokenValidationResponse = Awaited<ReturnType<typeof getUser>>;

export type NextApiRequestWithAuthRequired = NextApiRequest & {
  auth: TokenValidationResponse;
  viewer: NonNullable<GetViewerByIdQuery['usersByPk']>;
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

      const viewer = await getViewerById({
        id: auth.data.user.id,
      });

      if (!viewer) {
        return response401UnauthorizedError(response, 'You must be logged in');
      }

      request.viewer = viewer;
    } catch (error) {
      console.error('Authentication error:', error);
      return response401UnauthorizedError(response, 'You must be logged in');
    }

    return handler(request, response);
  };
