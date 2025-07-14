import { NextApiResponse } from 'next';
import {
  response200Success,
  response400BadRequestError,
  response500ServerError,
} from '@/lib/server/serverless/http';
import {
  NextApiRequestWithAuthOptional,
  withAuthOptional,
} from '@/lib/server/serverless/middleware/withAuthOptional';
import { HttpMethods, withHttpMethods } from '@/lib/server/serverless/middleware/withHttpMethods';

interface PIMSWebhookPayload {
  event: 'case.created' | 'case.updated' | 'patient.created' | 'patient.updated';
  timestamp: string;
  data: {
    caseId?: string;
    patientId?: string;
    clinicId: string;
    details: any;
  };
}

const POST = async (req: NextApiRequestWithAuthOptional, res: NextApiResponse) => {
  try {
    const payload: PIMSWebhookPayload = req.body;

    // Validate webhook payload
    if (!payload.event || !payload.data || !payload.clinicId) {
      return response400BadRequestError(res, 'Invalid webhook payload');
    }

    console.log(`Received PIMS webhook: ${payload.event}`, {
      clinicId: payload.data.clinicId,
      timestamp: payload.timestamp,
    });

    // Process different event types
    switch (payload.event) {
      case 'case.created':
        await handleCaseCreated(payload.data);
        break;
      
      case 'case.updated':
        await handleCaseUpdated(payload.data);
        break;
        
      case 'patient.created':
        await handlePatientCreated(payload.data);
        break;
        
      case 'patient.updated':
        await handlePatientUpdated(payload.data);
        break;
        
      default:
        console.warn(`Unknown webhook event: ${payload.event}`);
    }

    // Return success response immediately
    return response200Success(res, {
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return response500ServerError(
      res,
      error instanceof Error ? error.message : 'Failed to process webhook'
    );
  }
};

async function handleCaseCreated(data: any) {
  // In a real implementation, this would:
  // 1. Map PIMS case data to our format
  // 2. Create or update the case in our database
  // 3. Notify relevant staff members
  console.log('Processing case created:', data);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function handleCaseUpdated(data: any) {
  // Update existing case with new information from PIMS
  console.log('Processing case updated:', data);
  
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function handlePatientCreated(data: any) {
  // Create new patient profile from PIMS data
  console.log('Processing patient created:', data);
  
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function handlePatientUpdated(data: any) {
  // Update existing patient profile with PIMS data
  console.log('Processing patient updated:', data);
  
  await new Promise(resolve => setTimeout(resolve, 100));
}

export default withHttpMethods({
  [HttpMethods.Post]: withAuthOptional(POST),
});