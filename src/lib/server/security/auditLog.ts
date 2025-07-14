import { NextApiRequest } from 'next';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  method: string;
  path: string;
  statusCode?: number;
  metadata?: Record<string, any>;
  duration?: number;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];

  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    // In production, this would write to a database or log aggregation service
    this.logs.push(logEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUDIT]', JSON.stringify(logEntry, null, 2));
    }

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // await this.sendToLoggingService(logEntry);
    }
  }

  async logRequest(
    req: NextApiRequest,
    action: string,
    resource: string,
    options?: {
      resourceId?: string;
      userId?: string;
      userEmail?: string;
      userRole?: string;
      metadata?: Record<string, any>;
      statusCode?: number;
      duration?: number;
    }
  ): Promise<void> {
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress = forwarded
      ? Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0]
      : req.socket.remoteAddress || 'unknown';

    await this.log({
      action,
      resource,
      resourceId: options?.resourceId,
      userId: options?.userId,
      userEmail: options?.userEmail,
      userRole: options?.userRole,
      ipAddress,
      userAgent: req.headers['user-agent'] || 'unknown',
      method: req.method || 'unknown',
      path: req.url || 'unknown',
      statusCode: options?.statusCode,
      metadata: options?.metadata,
      duration: options?.duration,
    });
  }

  async logSecurity(
    event: 'login_success' | 'login_failure' | 'logout' | 'password_reset' | 'unauthorized_access',
    req: NextApiRequest,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logRequest(req, event, 'auth', {
      metadata: details,
    });
  }

  async query(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    let results = [...this.logs];

    if (filters.userId) {
      results = results.filter(log => log.userId === filters.userId);
    }

    if (filters.action) {
      results = results.filter(log => log.action === filters.action);
    }

    if (filters.resource) {
      results = results.filter(log => log.resource === filters.resource);
    }

    if (filters.startDate) {
      results = results.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      results = results.filter(log => log.timestamp <= filters.endDate!);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  // For production, implement these methods
  private async sendToLoggingService(entry: AuditLogEntry): Promise<void> {
    // Implement integration with logging service like:
    // - AWS CloudWatch
    // - Datadog
    // - Splunk
    // - ELK Stack
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

// Middleware for automatic request logging
export function withAuditLog(
  action: string,
  resource: string
) {
  return (handler: (req: NextApiRequest, res: any) => Promise<void>) => {
    return async (req: NextApiRequest, res: any) => {
      const startTime = Date.now();

      // Override res.status to capture status code
      const originalStatus = res.status;
      let statusCode: number;

      res.status = function(code: number) {
        statusCode = code;
        return originalStatus.call(this, code);
      };

      try {
        await handler(req, res);
      } finally {
        const duration = Date.now() - startTime;

        // Log the request
        await auditLogger.logRequest(req, action, resource, {
          userId: (req as any).user?.id,
          userEmail: (req as any).user?.email,
          userRole: (req as any).user?.role,
          statusCode: statusCode!,
          duration,
        });
      }
    };
  };
}