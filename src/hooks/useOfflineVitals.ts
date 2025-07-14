import { useState } from 'react';
import { offlineStorage } from '@/services/client/offline/storage';
import { showNotification } from '@/utils/notifications';

interface VitalsData {
  petId: string;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  weight: number;
  mucousMembraneColor: string;
  capillaryRefillTime: number;
  painScale: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  oxygenSaturation?: number;
  triageLevel: 'green' | 'yellow' | 'red';
  presentingComplaint: string;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export function useOfflineVitals() {
  const [isSaving, setIsSaving] = useState(false);

  const saveVitals = async (vitals: VitalsData): Promise<{ success: boolean; id?: string }> => {
    setIsSaving(true);

    try {
      // Try to save online first
      if (navigator.onLine) {
        try {
          const response = await fetch('/api/vitals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(vitals),
          });

          if (response.ok) {
            const data = await response.json();
            showNotification({
              title: 'Vitals Saved',
              message: 'Vitals have been recorded successfully',
              type: 'success',
            });
            return { success: true, id: data.id };
          }
        } catch (error) {
          console.error('Online save failed, falling back to offline:', error);
        }
      }

      // If offline or online save failed, save locally
      const offlineId = await offlineStorage.saveOfflineData({
        type: 'vitals',
        data: vitals,
      });

      showNotification({
        title: navigator.onLine ? 'Saved Locally' : 'Offline Mode',
        message: 'Vitals saved locally and will sync when online',
        type: 'info',
      });

      // Request background sync if supported
      if ('serviceWorker' in navigator && 'sync' in (navigator.serviceWorker as any)) {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('sync-vitals');
      }

      return { success: true, id: offlineId };
    } catch (error) {
      console.error('Failed to save vitals:', error);
      showNotification({
        title: 'Save Failed',
        message: 'Failed to save vitals. Please try again.',
        type: 'error',
      });
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveVitals,
    isSaving,
  };
}