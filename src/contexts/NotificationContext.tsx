import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Notification {
  id: string;
  type: "order" | "auction" | "shipping" | "system" | "payment";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionLink?: string;
  metadata?: {
    orderId?: string;
    auctionId?: string;
    productName?: string;
    amount?: number;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`madeinpk_notifications_${user.email}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        // Add welcome notifications for new users
        const welcomeNotifications: Notification[] = [
          {
            id: `notif_welcome_${Date.now()}`,
            type: 'system',
            title: 'Welcome to MadeInPK! 🎉',
            message: 'Discover authentic Pakistani handcrafted products. Browse our auctions and products today!',
            timestamp: Date.now(),
            read: false,
          },
        ];
        setNotifications(welcomeNotifications);
      }
    } else {
      setNotifications([]);
    }
  }, [user?.email]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`madeinpk_notifications_${user.email}`, JSON.stringify(notifications));
    }
  }, [notifications, user?.email]);

  const addNotification = (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
