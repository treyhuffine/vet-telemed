import { GetViewerByIdQuery } from '@/types/generated/server';
import { getViewerById } from '@/services/server/graphql/queries/getViewerById';
import { getUser } from '@/services/server/supabase/rsc';

type TokenValidationResponse = Awaited<ReturnType<typeof getUser>>;

export type RequestWithAuthOptional = Request & {
  auth: TokenValidationResponse | null;
  viewer?: GetViewerByIdQuery['usersByPk'];
};

// Extract authorization token from Request object
const getAuthToken = (request: Request): string | undefined => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
};

export const withAuthOptional = (
  handler: (request: RequestWithAuthOptional) => Promise<Response>,
) => {
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

      (request as RequestWithAuthOptional).auth = auth;

      if (auth?.data?.user) {
        const viewer = await getViewerById({
          id: auth.data.user.id,
        });

        (request as RequestWithAuthOptional).viewer = viewer;
      }
    } catch (error) {
      // Ignore: this could fail but the auth is optional
      console.error('Authentication error (optional):', error);
      (request as RequestWithAuthOptional).auth = null;
    }

    return handler(request as RequestWithAuthOptional);
  };
};
