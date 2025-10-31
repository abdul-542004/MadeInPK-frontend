import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { 
  notificationService, 
  Notification as BackendNotification 
} from "../services/notificationService";
import { MOCK_MODE, mockDelay } from "../lib/mockMode";
import { toast } from "sonner";

export interface Notification {
  id: number;
  user?: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_id?: number;
  related_type?: string;
  action_url?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, "id" | "created_at" | "is_read">) => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    if (MOCK_MODE || isAuthenticated) {
      refreshNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const refreshNotifications = async () => {
    if (!isAuthenticated && !MOCK_MODE) return;

    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(300);
        const saved = localStorage.getItem('mockNotifications');
        if (saved) {
          setNotifications(JSON.parse(saved));
        } else {
          // Welcome notification for mock mode
          const welcome: Notification = {
            id: Date.now(),
            notification_type: 'system',
            title: 'Welcome to MadeInPK! 🎉',
            message: 'Discover authentic Pakistani handcrafted products.',
            is_read: false,
            created_at: new Date().toISOString(),
          };
          setNotifications([welcome]);
          localStorage.setItem('mockNotifications', JSON.stringify([welcome]));
        }
      } else {
        const response = await notificationService.getNotifications({ page_size: 50 });
        setNotifications(response.results);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notificationData: Omit<Notification, "id" | "created_at" | "is_read">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    
    if (MOCK_MODE) {
      localStorage.setItem('mockNotifications', JSON.stringify([newNotification, ...notifications]));
    }
  };

  const markAsRead = async (id: number) => {
    try {
      if (MOCK_MODE) {
        const updated = notifications.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        );
        setNotifications(updated);
        localStorage.setItem('mockNotifications', JSON.stringify(updated));
      } else {
        await notificationService.markAsRead(id);
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
        );
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (MOCK_MODE) {
        const updated = notifications.map((notif) => ({ ...notif, is_read: true }));
        setNotifications(updated);
        localStorage.setItem('mockNotifications', JSON.stringify(updated));
      } else {
        await notificationService.markAllAsRead();
        setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
      }
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      if (MOCK_MODE) {
        const updated = notifications.filter((notif) => notif.id !== id);
        setNotifications(updated);
        localStorage.setItem('mockNotifications', JSON.stringify(updated));
      } else {
        await notificationService.deleteNotification(id);
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const clearAll = () => {
    setNotifications([]);
    if (MOCK_MODE) {
      localStorage.removeItem('mockNotifications');
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        refreshNotifications,
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
