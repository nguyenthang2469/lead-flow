import { create } from 'zustand';

type TNotificationType = 'info' | 'success' | 'warning';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: TNotificationType;
  createdAt: Date;
  read: boolean;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (
    n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
  ) => void;
  markAllRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (n) =>
    set((state) => {
      const newNotif: AppNotification = {
        ...n,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        read: false,
      };
      return {
        notifications: [newNotif, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));
