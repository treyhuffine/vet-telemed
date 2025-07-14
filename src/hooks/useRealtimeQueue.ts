import { useEffect, useState, useCallback } from 'react';
import { useDemoData } from '@/context/DemoData';

// Hook for real-time queue updates using demo data
export function useRealtimeQueue() {
  const { cases, subscribeToUpdates } = useDemoData();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to updates
  useEffect(() => {
    // Simulate connection
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 500);

    // Subscribe to demo data updates
    const unsubscribe = subscribeToUpdates((type, data) => {
      if (type.includes('case_')) {
        setLastUpdate(new Date());
      }
    });

    return () => {
      clearTimeout(connectTimeout);
      unsubscribe();
    };
  }, [subscribeToUpdates]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    setLastUpdate(new Date());
  }, []);

  return {
    cases,
    isConnected,
    lastUpdate,
    refresh,
    isLoading,
    error,
  };
}

// Hook for subscribing to specific case updates
export function useRealtimeCase(caseId: string | null) {
  const { getCase, subscribeToUpdates } = useDemoData();
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!caseId) {
      setCaseData(null);
      setIsLoading(false);
      return;
    }

    // Get initial case data
    const foundCase = getCase(caseId);
    setCaseData(foundCase || null);
    setIsLoading(false);

    // Subscribe to updates for this specific case
    const unsubscribe = subscribeToUpdates((type, data) => {
      if (type === 'case_updated' && data.id === caseId) {
        setCaseData((prev: any) => ({ ...prev, ...data.updates }));
      }
    });

    return unsubscribe;
  }, [caseId, getCase, subscribeToUpdates]);

  return {
    case: caseData,
    isLoading,
  };
}

// Hook for real-time staff availability
export function useRealtimeStaffAvailability() {
  const [availableStaff, setAvailableStaff] = useState<string[]>(['vet-1', 'vet-2', 'tech-1']);
  
  useEffect(() => {
    // Simulate staff availability changes
    const interval = setInterval(() => {
      setAvailableStaff(prev => {
        const allStaffIds = ['vet-1', 'vet-2', 'vet-3', 'tech-1', 'tech-2'];
        // Randomly toggle availability
        if (Math.random() > 0.8) {
          const randomId = allStaffIds[Math.floor(Math.random() * allStaffIds.length)];
          if (prev.includes(randomId)) {
            return prev.filter(id => id !== randomId);
          } else {
            return [...prev, randomId];
          }
        }
        return prev;
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return availableStaff;
}

// Hook for real-time notifications
export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { subscribeToUpdates } = useDemoData();
  
  useEffect(() => {
    // Subscribe to case updates that might generate notifications
    const unsubscribe = subscribeToUpdates((type, data) => {
      if (type === 'case_added' && data.triageLevel === 'red') {
        const newNotification = {
          id: Date.now().toString(),
          userId,
          type: 'new_case',
          title: 'New Red Triage Case',
          message: `Critical case: ${data.petName} - ${data.chiefComplaint}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });
    
    return unsubscribe;
  }, [userId, subscribeToUpdates]);
  
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}