import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  RequestWithViewer,
  withViewerRequired,
} from '@/lib/server/rsc/middleware/withViewerRequired';

const resend = new Resend(process.env.RESEND_API_KEY);

export const DELETE = withViewerRequired(async (request: RequestWithViewer) => {
  const auth = request.auth;
  const user = auth?.data?.user;
  const userId = user?.id;
  const viewer = request.viewer;

  const response = await resend.emails.send({
    from: 'onboarding@resend.dev',
    /**
     * @todo MAKE SOURDO ALIAS and change to support@sour.do
     */
    to: 'accounts@sour.do',
    subject: 'Account Deletion Request',
    text: `User ID: ${userId}\nName: ${viewer?.name}\nEmail: ${viewer?.email}`,
  });

  console.log('response', response);

  return NextResponse.json({
    success: true,
  });
});
