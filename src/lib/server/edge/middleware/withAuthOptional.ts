import { NextRequest, NextResponse } from 'next/server';
import { GetViewerByIdQuery } from '@/types/generated/server';
import { getViewerById } from '@/services/server/graphql/queries/getViewerById';
import { getUser } from '@/services/server/supabase/edge';

type TokenValidationResponse = Awaited<ReturnType<typeof getUser>>;

export interface NextApiRequestWithAuthOptional extends NextRequest {
  auth?: TokenValidationResponse | null;
  viewer?: GetViewerByIdQuery['usersByPk'];
}

export const withAuthOptional =
  (
    handler: (
      request: NextApiRequestWithAuthOptional,
      response: NextResponse,
    ) => unknown | Promise<unknown>,
  ) =>
  async (request: NextApiRequestWithAuthOptional, response: NextResponse) => {
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
