import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { 
  Package, 
  Gavel, 
  Truck, 
  AlertCircle, 
  CreditCard, 
  CheckCheck
} from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "order_shipped":
      case "order_delivered":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "bid_placed":
      case "bid_outbid":
      case "auction_won":
      case "auction_lost":
      case "auction_ended":
        return <Gavel className="w-5 h-5 text-emerald-600" />;
      case "payment_reminder":
      case "payment_received":
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case "message_received":
        return <Package className="w-5 h-5 text-purple-600" />;
      case "account_blocked":
      case "general":
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return "over a week ago";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        <SheetTitle className="sr-only">Notifications</SheetTitle>
        <SheetDescription className="sr-only">
          View your notifications and updates
        </SheetDescription>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h3 className="text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">{unreadCount} unread</p>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-center">No notifications yet</p>
              <p className="text-sm text-gray-500 text-center mt-2">
                You'll see updates about your orders and auctions here
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? "bg-emerald-50/50" : ""
                  }`}
                  onClick={async () => {
                    console.log('Notification clicked:', notification.id, 'is_read:', notification.is_read);
                    if (!notification.is_read) {
                      console.log('Marking as read:', notification.id);
                      await markAsRead(notification.id);
                      console.log('Marked as read successfully');
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm ${!notification.is_read ? "text-gray-900" : "text-gray-700"}`}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <Badge className="bg-emerald-600 h-2 w-2 p-0 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
