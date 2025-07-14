import { NextApiResponse } from 'next';
import {
  response200Success,
  response400BadRequestError,
  response403ForbiddenError,
  response500ServerError,
  responseJson200Success,
} from '@/lib/server/serverless/http';
import {
  NextApiRequestWithAuthRequired,
  withAuthRequired,
} from '@/lib/server/serverless/middleware/withAuthRequired';
import { HttpMethods, withHttpMethods } from '@/lib/server/serverless/middleware/withHttpMethods';
import { pimsWebhookService } from '@/services/server/webhooks/pims';

interface WebhookConfig {
  provider: string;
  enabled: boolean;
  webhookUrl: string;
  events: string[];
  lastTest?: {
    timestamp: string;
    success: boolean;
    message?: string;
  };
}

// Mock webhook configurations - in real app would be in database
const webhookConfigs: Record<string, WebhookConfig> = {
  avimark: {
    provider: 'avimark',
    enabled: false,
    webhookUrl: '',
    events: ['case.created', 'case.updated', 'consultation.completed'],
  },
  cornerstone: {
    provider: 'cornerstone',
    enabled: false,
    webhookUrl: '',
    events: ['case.created', 'case.updated', 'patient.updated'],
  },
  impromed: {
    provider: 'impromed',
    enabled: false,
    webhookUrl: '',
    events: ['case.created', 'consultation.completed'],
  },
  vetspire: {
    provider: 'vetspire',
    enabled: false,
    webhookUrl: '',
    events: ['case.created', 'case.updated', 'patient.updated', 'consultation.completed'],
  },
};

const GET = async (req: NextApiRequestWithAuthRequired, res: NextApiResponse) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return response403ForbiddenError(res, 'Admin access required');
    }

    const { provider } = req.query;

    if (provider && typeof provider === 'string') {
      const config = webhookConfigs[provider];
      if (!config) {
        return response400BadRequestError(res, 'Invalid provider');
      }
      return responseJson200Success(res, config);
    }

    // Return all configurations
    return responseJson200Success(res, webhookConfigs);
  } catch (error) {
    console.error('Error fetching webhook config:', error);
    return response500ServerError(
      res,
      error instanceof Error ? error.message : 'Failed to fetch webhook configuration'
    );
  }
};

const PUT = async (req: NextApiRequestWithAuthRequired, res: NextApiResponse) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return response403ForbiddenError(res, 'Admin access required');
    }

    const { provider } = req.query;
    if (!provider || typeof provider !== 'string') {
      return response400BadRequestError(res, 'Provider is required');
    }

    const config = webhookConfigs[provider];
    if (!config) {
      return response400BadRequestError(res, 'Invalid provider');
    }

    const { enabled, webhookUrl, events } = req.body;

    // Update configuration
    if (enabled !== undefined) config.enabled = enabled;
    if (webhookUrl !== undefined) config.webhookUrl = webhookUrl;
    if (events !== undefined && Array.isArray(events)) config.events = events;

    // In a real app, this would save to database
    webhookConfigs[provider] = config;

    return responseJson200Success(res, {
      success: true,
      config,
    });
  } catch (error) {
    console.error('Error updating webhook config:', error);
    return response500ServerError(
      res,
      error instanceof Error ? error.message : 'Failed to update webhook configuration'
    );
  }
};

const POST = async (req: NextApiRequestWithAuthRequired, res: NextApiResponse) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return response403ForbiddenError(res, 'Admin access required');
    }

    const { action, provider } = req.body;

    if (action === 'test') {
      if (!provider || typeof provider !== 'string') {
        return response400BadRequestError(res, 'Provider is required for testing');
      }

      const config = webhookConfigs[provider];
      if (!config) {
        return response400BadRequestError(res, 'Invalid provider');
      }

      if (!config.enabled || !config.webhookUrl) {
        return response400BadRequestError(res, 'Webhook not configured or enabled');
      }

      // Test webhook connection
      const success = await pimsWebhookService.testConnection();
      
      // Update last test result
      config.lastTest = {
        timestamp: new Date().toISOString(),
        success,
        message: success ? 'Connection successful' : 'Connection failed',
      };

      return responseJson200Success(res, {
        success,
        message: config.lastTest.message,
        timestamp: config.lastTest.timestamp,
      });
    }

    return response400BadRequestError(res, 'Invalid action');
  } catch (error) {
    console.error('Error testing webhook:', error);
    return response500ServerError(
      res,
      error instanceof Error ? error.message : 'Failed to test webhook'
    );
  }
};

export default withHttpMethods({
  [HttpMethods.Get]: withAuthRequired(GET),
  [HttpMethods.Put]: withAuthRequired(PUT),
  [HttpMethods.Post]: withAuthRequired(POST),
});