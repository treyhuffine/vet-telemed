'use client';

import { useEffect, useState } from 'react';
import { useOffline } from '@/hooks/useOffline';
import { offlineSync } from '@/services/client/offline/sync';
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function OfflineIndicator() {
  const { isOffline, isSlowConnection } = useOffline();
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Check unsynced data count
    const checkUnsyncedData = async () => {
      const count = await offlineSync.getOfflineDataCount();
      setUnsyncedCount(count);
    };

    checkUnsyncedData();
    
    // Check periodically
    const interval = setInterval(checkUnsyncedData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    if (isOffline || isSyncing) return;
    
    setIsSyncing(true);
    try {
      await offlineSync.syncPendingData();
      const count = await offlineSync.getOfflineDataCount();
      setUnsyncedCount(count);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOffline && unsyncedCount === 0 && !isSlowConnection) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
      {isOffline && (
        <Badge variant="destructive" className="flex items-center gap-2 px-3 py-2">
          <WifiOff className="h-4 w-4" />
          <span>Offline Mode</span>
        </Badge>
      )}

      {isSlowConnection && !isOffline && (
        <Badge variant="outline" className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border-yellow-300">
          <Wifi className="h-4 w-4 text-yellow-600" />
          <span className="text-yellow-700">Slow Connection</span>
        </Badge>
      )}

      {unsyncedCount > 0 && !isOffline && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="h-4 w-4" />
                    <span>{unsyncedCount} Unsynced</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to manually sync offline data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {unsyncedCount > 0 && isOffline && (
        <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2">
          <Cloud className="h-4 w-4" />
          <span>{unsyncedCount} items pending sync</span>
        </Badge>
      )}
    </div>
  );
}