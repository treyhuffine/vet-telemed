import { offlineStorage } from './storage';
import { showNotification } from '@/utils/notifications';

export class OfflineSync {
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;

  startAutoSync(intervalMs = 30000) {
    // Clear any existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Initial sync
    this.syncPendingData();

    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.syncPendingData();
      }
    }, intervalMs);

    // Sync when coming back online
    window.addEventListener('online', () => {
      this.syncPendingData();
    });
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncPendingData() {
    if (this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;
    
    try {
      const unsyncedData = await offlineStorage.getUnsyncedData();
      
      if (unsyncedData.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`Syncing ${unsyncedData.length} offline items...`);
      
      let successCount = 0;
      let errorCount = 0;

      for (const item of unsyncedData) {
        try {
          await this.syncItem(item);
          await offlineStorage.markAsSynced(item.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          errorCount++;
        }
      }

      // Clean up synced data
      await offlineStorage.clearSyncedData();

      // Show notification
      if (successCount > 0) {
        showNotification({
          title: 'Data Synced',
          message: `Successfully synced ${successCount} items`,
          type: 'success',
        });
      }

      if (errorCount > 0) {
        showNotification({
          title: 'Sync Errors',
          message: `Failed to sync ${errorCount} items. Will retry later.`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
      showNotification({
        title: 'Sync Failed',
        message: 'Failed to sync offline data. Will retry later.',
        type: 'error',
      });
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: any) {
    const endpoint = this.getEndpointForType(item.type);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Offline-Sync': 'true',
      },
      body: JSON.stringify({
        ...item.data,
        offlineTimestamp: item.timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync: ${response.statusText}`);
    }

    return response.json();
  }

  private getEndpointForType(type: string): string {
    const endpoints: Record<string, string> = {
      vitals: '/api/vitals',
      patient: '/api/patients',
      notes: '/api/notes',
      case: '/api/cases',
    };

    return endpoints[type] || '/api/sync';
  }

  async getOfflineDataCount(): Promise<number> {
    const data = await offlineStorage.getUnsyncedData();
    return data.length;
  }
}

export const offlineSync = new OfflineSync();