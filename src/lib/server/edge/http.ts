import { NextRequest, NextResponse } from 'next/server';
import { cors } from '@/lib/server/edge/cors';

interface ErrorObject {
  statusCode?: number;
  message?: string;
}
export const createErrorObject = (errorObject: ErrorObject) => errorObject;
export const response400BadRequestError = (request: NextRequest, message: string) =>
  cors(
    request,
    NextResponse.json(
      {
        message,
      },
      { status: 400 },
    ),
  );

export const response401UnauthorizedError = (request: NextRequest, message: string) =>
  cors(
    request,
    NextResponse.json(
      {
        message,
      },
      { status: 401 },
    ),
  );
export const response403ForbiddenError = (request: NextRequest, message: string) =>
  cors(
    request,
    NextResponse.json(
      {
        message,
      },
      { status: 403 },
    ),
  );
export const response405InvalidMethodError = (request: NextRequest, message: string) =>
  cors(
    request,
    NextResponse.json(
      {
        message,
      },
      { status: 405 },
    ),
  );
export const response500ServerError = (request: NextRequest, message: string) =>
  cors(
    request,
    NextResponse.json(
      {
        message,
      },
      { status: 500 },
    ),
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function responseJson200Success<T = any>(request: NextRequest, data: T) {
  return cors(request, NextResponse.json(data, { status: 200 }));
}
