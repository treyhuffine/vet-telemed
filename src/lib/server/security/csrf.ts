import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrf-token';

export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

export function validateCSRFToken(req: NextApiRequest): boolean {
  // Skip CSRF validation for GET and HEAD requests
  if (['GET', 'HEAD'].includes(req.method || '')) {
    return true;
  }

  const tokenFromHeader = req.headers[CSRF_HEADER];
  const tokenFromCookie = req.cookies[CSRF_COOKIE];

  if (!tokenFromHeader || !tokenFromCookie) {
    return false;
  }

  // Compare tokens
  return tokenFromHeader === tokenFromCookie;
}

export function withCSRFProtection(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Generate and set CSRF token for GET requests
    if (req.method === 'GET') {
      const token = generateCSRFToken();
      res.setHeader(
        'Set-Cookie',
        `${CSRF_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
      );
      return handler(req, res);
    }

    // Validate CSRF token for state-changing requests
    if (!validateCSRFToken(req)) {
      res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
      });
      return;
    }

    return handler(req, res);
  };
}