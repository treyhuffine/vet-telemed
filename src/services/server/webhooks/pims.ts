interface WebhookEvent {
  event: string;
  timestamp: string;
  data: any;
  retryCount?: number;
}

interface PIMSConfig {
  webhookUrl: string;
  apiKey: string;
  enabled: boolean;
}

class PIMSWebhookService {
  private config: PIMSConfig | null = null;
  private queue: WebhookEvent[] = [];
  private processing = false;

  constructor() {
    // In a real app, this would load from database/env
    this.config = {
      webhookUrl: process.env.PIMS_WEBHOOK_URL || '',
      apiKey: process.env.PIMS_API_KEY || '',
      enabled: process.env.PIMS_ENABLED === 'true',
    };
  }

  async sendCaseCreated(caseData: any) {
    await this.sendWebhook({
      event: 'case.created',
      timestamp: new Date().toISOString(),
      data: {
        caseId: caseData.id,
        patientId: caseData.patientId,
        clinicId: caseData.clinicId,
        triageLevel: caseData.triageLevel,
        presentingComplaint: caseData.presentingComplaint,
        vitals: caseData.vitals,
        createdAt: caseData.createdAt,
      },
    });
  }

  async sendCaseUpdated(caseData: any) {
    await this.sendWebhook({
      event: 'case.updated',
      timestamp: new Date().toISOString(),
      data: {
        caseId: caseData.id,
        updates: caseData.updates,
        updatedBy: caseData.updatedBy,
        updatedAt: caseData.updatedAt,
      },
    });
  }

  async sendConsultationCompleted(consultationData: any) {
    await this.sendWebhook({
      event: 'consultation.completed',
      timestamp: new Date().toISOString(),
      data: {
        consultationId: consultationData.id,
        caseId: consultationData.caseId,
        veterinarianId: consultationData.veterinarianId,
        duration: consultationData.duration,
        notes: consultationData.notes,
        treatmentPlan: consultationData.treatmentPlan,
        completedAt: consultationData.completedAt,
      },
    });
  }

  async sendPatientUpdated(patientData: any) {
    await this.sendWebhook({
      event: 'patient.updated',
      timestamp: new Date().toISOString(),
      data: {
        patientId: patientData.id,
        updates: patientData.updates,
        updatedAt: patientData.updatedAt,
      },
    });
  }

  private async sendWebhook(event: WebhookEvent) {
    if (!this.config?.enabled || !this.config.webhookUrl) {
      console.log('PIMS webhook disabled or not configured');
      return;
    }

    // Add to queue
    this.queue.push(event);

    // Process queue if not already processing
    if (!this.processing) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (!event) continue;

      try {
        await this.sendSingleWebhook(event);
      } catch (error) {
        console.error('Failed to send webhook:', error);
        
        // Retry logic
        if ((event.retryCount || 0) < 3) {
          event.retryCount = (event.retryCount || 0) + 1;
          // Add back to queue with exponential backoff
          setTimeout(() => {
            this.queue.push(event);
            this.processQueue();
          }, Math.pow(2, event.retryCount) * 1000);
        } else {
          // Log failed webhook for manual review
          console.error('Webhook failed after 3 retries:', event);
          await this.logFailedWebhook(event);
        }
      }
    }

    this.processing = false;
  }

  private async sendSingleWebhook(event: WebhookEvent) {
    if (!this.config?.webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    const response = await fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'X-Event-Type': event.event,
        'X-Timestamp': event.timestamp,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log(`Successfully sent webhook: ${event.event}`);
  }

  private async logFailedWebhook(event: WebhookEvent) {
    // In a real app, this would save to database for manual review
    console.error('Failed webhook logged:', {
      event: event.event,
      timestamp: event.timestamp,
      retries: event.retryCount,
      data: event.data,
    });
  }

  // Utility method to test webhook connection
  async testConnection(): Promise<boolean> {
    if (!this.config?.enabled || !this.config.webhookUrl) {
      return false;
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
          'X-Event-Type': 'test.ping',
          'X-Timestamp': new Date().toISOString(),
        },
        body: JSON.stringify({
          event: 'test.ping',
          timestamp: new Date().toISOString(),
          data: { message: 'Testing webhook connection' },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Webhook test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const pimsWebhookService = new PIMSWebhookService();