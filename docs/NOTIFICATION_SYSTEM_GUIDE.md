# Notification System Guide

## Overview

A comprehensive notification system has been implemented in MadeInPK that keeps users informed about their orders, auction activities, and system updates.

## Features

### 🔔 Bell Icon in Header
- **Location:** Top-right corner of header (next to cart icon)
- **Visibility:** Only appears when user is logged in
- **Badge:** Shows unread notification count with animated pulse effect
- **Click:** Opens the notification panel

### 📱 Notification Panel
A slide-out panel that displays all user notifications with:
- **Real-time updates:** Notifications appear instantly
- **Time stamps:** Shows how long ago each notification was received
- **Visual indicators:** Unread notifications have green background
- **Action buttons:**
  - Mark individual notifications as read
  - Mark all as read
  - Delete individual notifications
  - Clear all notifications

### 🎯 Notification Types

#### 1. **Auction Notifications** (🎨 Emerald)
- Bid placed confirmation
- Outbid alerts (when someone bids higher)
- Auction won (when you win)
- Auction lost (when auction ends and you didn't win)
- Seller: Auction ended with winner details
- Seller: Auction ended with no bids

#### 2. **Order Notifications** (🔵 Blue)
- Order placed confirmation
- Order processing updates
- Payment confirmations

#### 3. **Shipping Notifications** (🟣 Purple)
- Order shipped
- Out for delivery
- Delivered confirmation

#### 4. **Payment Notifications** (🟢 Green)
- Payment received
- Refund processed

#### 5. **System Notifications** (🟡 Amber)
- Welcome message for new users
- Account updates
- System announcements

## How It Works

### For Customers

**Auction Bidding Flow:**
1. Customer places a bid → Receives "Bid Placed Successfully" notification
2. Someone bids higher → Receives "You've been outbid" notification (future feature)
3. Auction ends:
   - If won: Receives "🎉 You Won the Auction!" notification
   - If lost: Receives "Auction Ended" notification with final price

**Shopping Flow:**
1. Place order → "Order Placed" notification
2. Order processing → "Order Processing" notification
3. Order shipped → "Order Shipped" notification
4. Delivered → "Delivered" notification

### For Sellers

**Auction Management:**
1. Create auction → Listed on auction page
2. Customer bids → Can see bid count in seller dashboard
3. Auction ends:
   - With winner: "Auction Ended Successfully" notification with winner details
   - No bids: "Auction Ended - No Bids" notification

**Order Management:**
1. New order → "New Order Received" notification
2. Order updates through seller dashboard

## Technical Implementation

### Notification Storage
- **Per-user storage:** Each user has their own notification list
- **Persistent:** Stored in localStorage using user email as key
- **Format:** `madeinpk_notifications_{user.email}`

### Context Structure
```typescript
interface Notification {
  id: string;
  type: "order" | "auction" | "shipping" | "system" | "payment";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  metadata?: {
    orderId?: string;
    auctionId?: string;
    productName?: string;
    amount?: number;
  };
}
```

### Integration Points

**AuctionContext Integration:**
- Automatically creates notifications when auctions end
- Creates notifications when bids are placed
- Notifies winners, losers, and sellers

**Future Integration Points:**
- CartContext: Order placed notifications
- Seller Dashboard: Order status changes
- Admin Dashboard: System announcements

## User Experience

### Notification Panel UI
- **Header:** Shows unread count
- **Notifications List:**
  - Color-coded icons by type
  - Unread notifications highlighted with emerald background
  - Product name display for auction/order notifications
  - Relative timestamps (e.g., "5 minutes ago")
- **Actions:**
  - Click notification to mark as read
  - Click X to delete individual notification
  - "Mark all read" button in header
  - "Clear All" button in footer

### Visual Feedback
- **Unread badge:** Animated pulse effect on bell icon
- **Toast notifications:** Immediate feedback for actions
- **Color coding:** Each notification type has distinct color
- **Icons:** Visual indicators for quick scanning

## Testing

### Test Auction Notifications:

1. **Login as customer** (any email except `seller@madeinpk.com`)
2. **Go to Auctions** page
3. **Click on any auction** product
4. **Place a bid** → Check bell icon for new notification
5. **Wait for auction to end** (or modify times for testing)
6. **Check notifications** for win/loss status

### Test as Seller:

1. **Login as seller** (`seller@madeinpk.com`)
2. **View existing auctions** or create new one
3. **Wait for auction to end** 
4. **Check notifications** for auction results

### Test Welcome Notification:

1. **Create new account**
2. **Check bell icon** immediately after login
3. **Should see** welcome message

## Future Enhancements

### Planned Features:
- [ ] Email notifications (requires backend)
- [ ] Push notifications
- [ ] Notification preferences/settings
- [ ] Sound alerts for important notifications
- [ ] Real-time outbid alerts during active auctions
- [ ] Order tracking notifications
- [ ] Review/rating notifications
- [ ] Low stock alerts for sellers
- [ ] Message notifications

### Suggested Improvements:
- Filter notifications by type
- Search within notifications
- Archive old notifications
- Notification categories/folders
- Rich media in notifications (images, links)
- Action buttons within notifications (e.g., "View Order", "View Auction")

## UI Components

### Files Structure:
```
/contexts/NotificationContext.tsx       - Notification state management
/components/NotificationPanel.tsx      - Notification panel UI
/components/NotificationConnector.tsx  - Connects auction notifications
/components/Header.tsx                 - Bell icon integration
```

### Styling:
- Consistent with MadeInPK emerald green theme
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Accessibility-friendly with screen reader support

## API Reference

### useNotifications Hook

```typescript
const {
  notifications,        // Array of all notifications
  unreadCount,         // Number of unread notifications
  addNotification,     // Add a new notification
  markAsRead,          // Mark notification as read
  markAllAsRead,       // Mark all as read
  deleteNotification,  // Delete a notification
  clearAll            // Clear all notifications
} = useNotifications();
```

### Adding Custom Notifications

```typescript
addNotification({
  type: 'order',
  title: 'Order Shipped',
  message: 'Your order #12345 has been shipped',
  metadata: {
    orderId: '12345',
    productName: 'Handwoven Carpet'
  }
});
```

---

**Built with ❤️ for MadeInPK**  
Enhancing the user experience one notification at a time!
