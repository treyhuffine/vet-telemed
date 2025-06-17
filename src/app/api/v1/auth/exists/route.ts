import { NextRequest } from 'next/server';
import { PostRequestPayload, PostResponsePayload } from '@/constants/payloads/auth/exists';
import { getCheckUserExists } from '@/services/server/graphql/queries/getCheckUserExists';
import {
  response400BadRequestError,
  response500ServerError,
  responseJson200Success,
} from '@/lib/server/edge/http';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as PostRequestPayload;

  if (!email) {
    return response400BadRequestError(req, 'Email is required');
  }

  try {
    const users = await getCheckUserExists({ email });
    const doesExist = !!users?.[0]?.name;

    return responseJson200Success<PostResponsePayload>(req, { doesExist });
  } catch (error) {
    console.error('Error checking email:', error);
    return response500ServerError(req, 'Failed to check email');
  }
}
