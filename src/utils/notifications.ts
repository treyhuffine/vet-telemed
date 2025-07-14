interface NotificationOptions {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

class NotificationManager {
  private listeners: ((notification: NotificationOptions) => void)[] = [];

  show(options: NotificationOptions) {
    this.listeners.forEach(listener => listener(options));
  }

  subscribe(listener: (notification: NotificationOptions) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const notificationManager = new NotificationManager();

export function showNotification(options: NotificationOptions) {
  notificationManager.show(options);
}