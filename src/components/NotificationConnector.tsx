import { useEffect } from 'react';
import { setNotificationHandler } from '../contexts/AuctionContext';
import { useNotifications } from '../contexts/NotificationContext';

export function NotificationConnector({ children }: { children: React.ReactNode }) {
  const { addNotification } = useNotifications();

  useEffect(() => {
    setNotificationHandler(addNotification);
  }, [addNotification]);

  return <>{children}</>;
}
