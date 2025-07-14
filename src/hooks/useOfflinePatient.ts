import { useState } from 'react';
import { offlineStorage } from '@/services/client/offline/storage';
import { showNotification } from '@/utils/notifications';

interface PatientData {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  sex: 'male' | 'female' | 'unknown';
  microchipId?: string;
  medicalHistory?: string;
  allergies?: string[];
  currentMedications?: string[];
  ownerId: string;
}

export function useOfflinePatient() {
  const [isSaving, setIsSaving] = useState(false);

  const savePatient = async (patient: PatientData): Promise<{ success: boolean; id?: string }> => {
    setIsSaving(true);

    try {
      // Try to save online first
      if (navigator.onLine) {
        try {
          const response = await fetch('/api/patients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient),
          });

          if (response.ok) {
            const data = await response.json();
            showNotification({
              title: 'Patient Created',
              message: `${patient.name} has been added successfully`,
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
        type: 'patient',
        data: patient,
      });

      showNotification({
        title: navigator.onLine ? 'Saved Locally' : 'Offline Mode',
        message: `${patient.name} saved locally and will sync when online`,
        type: 'info',
      });

      return { success: true, id: offlineId };
    } catch (error) {
      console.error('Failed to save patient:', error);
      showNotification({
        title: 'Save Failed',
        message: 'Failed to save patient. Please try again.',
        type: 'error',
      });
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    savePatient,
    isSaving,
  };
}