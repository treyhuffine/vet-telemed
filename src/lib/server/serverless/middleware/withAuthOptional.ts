import { NextApiRequest, NextApiResponse } from 'next';
import { GetViewerByIdQuery } from '@/types/generated/server';
import { getViewerById } from '@/services/server/graphql/queries/getViewerById';
import { getUser } from '@/services/server/supabase/serverless';

type TokenValidationResponse = Awaited<ReturnType<typeof getUser>>;

export interface NextApiRequestWithAuthOptional extends NextApiRequest {
  auth?: TokenValidationResponse | null;
  viewer?: GetViewerByIdQuery['usersByPk'];
}

export const withAuthOptional =
  (
    handler: (
      request: NextApiRequestWithAuthOptional,
      response: NextApiResponse,
    ) => unknown | Promise<unknown>,
  ) =>
  async (request: NextApiRequestWithAuthOptional, response: NextApiResponse) => {
    try {
      const auth = await getUser(request, response);
      request.auth = auth;

      if (auth?.data.user) {
        const viewer = await getViewerById({
          id: auth.data.user.id,
        });

        request.viewer = viewer;
      }
    } catch (error) {
      // Ignore: this could fail but the auth is optional
      console.error('Authentication error (optional):', error);
      request.auth = null;
    }

    return handler(request, response);
  };
