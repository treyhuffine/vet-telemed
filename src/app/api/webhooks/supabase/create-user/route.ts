import * as Sentry from '@sentry/nextjs';
import { NextRequest } from 'next/server';
import { insertNewUser } from '@/services/server/graphql/mutations/insertNewUser';
import { updateCreatedAccountMetadata } from '@/services/server/supabase/rsc';
import { response400BadRequestError, response403ForbiddenError } from '@/lib/server/rsc/http';
import { IS_MOCK } from '@/constants/config';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Skip webhook processing in mock mode
  if (IS_MOCK) {
    return new Response('Mock mode - webhook skipped', { status: 200 });
  }
  
  const payload = await req.json();
  const { type, record, table } = payload;

  console.log('event', payload, type, record?.id, record?.email);

  // Get bearer token from Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token || token !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return response403ForbiddenError('Invalid token');
  }

  if (type === 'INSERT' && table === 'users') {
    console.log(`Processing new user signup: ${record.email}`);

    /**
     * @todo
     * - Create stripe user
     * - Add to email provider
     */

    await insertNewUser({
      id: record.id,
      email: record.email,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      stripeCustomerId: `CHANGE_ME-${Date.now()}`,
    });

    // Mark onboarding as completed
    await updateCreatedAccountMetadata(record.id).catch((error) => {
      Sentry.captureException(error);
      console.error('Error updating user metadata', error);
    });

    return new Response('Onboarding completed', { status: 200 });
  }

  return response400BadRequestError('Invalid event');
}
