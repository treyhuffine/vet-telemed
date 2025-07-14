import { NextRequest, NextResponse } from 'next/server';

export interface RequestWithViewer extends NextRequest {
  auth?: any;
  viewer?: any;
}

export function withViewerRequired(
  handler: (request: RequestWithViewer) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    // Mock auth check for demo
    return handler(request as RequestWithViewer);
  };
}