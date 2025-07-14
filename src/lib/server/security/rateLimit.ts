import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  private getKey(req: NextApiRequest): string {
    // Use IP address as key, with fallback to a default for development
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? 
      (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : 
      req.socket.remoteAddress || 'unknown';
    
    return `${ip}:${req.url}`;
  }

  async checkLimit(req: NextApiRequest): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.getKey(req);
    const now = Date.now();

    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      this.store[key].count++;
    }

    const allowed = this.store[key].count <= this.maxRequests;
    const remaining = Math.max(0, this.maxRequests - this.store[key].count);

    return {
      allowed,
      remaining,
      resetTime: this.store[key].resetTime,
    };
  }
}

// Create different rate limiters for different endpoints
export const generalRateLimiter = new RateLimiter(60000, 100); // 100 requests per minute
export const authRateLimiter = new RateLimiter(900000, 5); // 5 attempts per 15 minutes
export const apiRateLimiter = new RateLimiter(60000, 60); // 60 requests per minute

// Middleware function
export function withRateLimit(
  limiter: RateLimiter = generalRateLimiter
) {
  return (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const { allowed, remaining, resetTime } = await limiter.checkLimit(req);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limiter['maxRequests']);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());

      if (!allowed) {
        res.status(429).json({
          success: false,
          error: 'Too many requests, please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        });
        return;
      }

      return handler(req, res);
    };
  };
}