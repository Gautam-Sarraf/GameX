import { Notification } from '../types';
import { NOTIFICATIONS } from '../mock/data';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

let inMemoryNotifications = [...NOTIFICATIONS];

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    await delay();
    return inMemoryNotifications;
  }

  static async getUnreadCount(): Promise<number> {
    await delay();
    return inMemoryNotifications.filter(n => n.status === 'unread').length;
  }

  static async markAsRead(id: string): Promise<Notification> {
    await delay();
    inMemoryNotifications = inMemoryNotifications.map(n => 
      n.id === id ? { ...n, status: 'read' as const } : n
    );
    return inMemoryNotifications.find(n => n.id === id)!;
  }

  static async markAllAsRead(): Promise<void> {
    await delay();
    inMemoryNotifications = inMemoryNotifications.map(n => ({
      ...n,
      status: 'read' as const
    }));
  }

  static async deleteNotification(id: string): Promise<void> {
    await delay();
    inMemoryNotifications = inMemoryNotifications.filter(n => n.id !== id);
  }
}
