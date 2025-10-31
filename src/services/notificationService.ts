import apiClient from '../lib/apiClient';

/**
 * Notification related types
 */
export type NotificationType = 
  | 'order_placed'
  | 'order_shipped'
  | 'order_delivered'
  | 'auction_won'
  | 'auction_outbid'
  | 'auction_ending'
  | 'new_bid'
  | 'product_approved'
  | 'product_rejected'
  | 'payment_received'
  | 'message_received';

export interface Notification {
  id: number;
  user: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_id?: number; // Order ID, Auction ID, etc.
  related_type?: string; // 'order', 'auction', etc.
  action_url?: string; // Link to related resource
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Notification Service
 * Handles notification related API calls and WebSocket connection
 */
export const notificationService = {
  /**
   * Get list of notifications for current user
   * GET /api/notifications/
   */
  getNotifications: async (filters?: {
    is_read?: boolean;
    notification_type?: NotificationType;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Notification>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      `/notifications/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Mark notification as read
   * PATCH /api/notifications/{id}/mark_read/
   */
  markAsRead: async (notificationId: number): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(
      `/notifications/${notificationId}/mark_read/`
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   * POST /api/notifications/mark_all_read/
   */
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/notifications/mark_all_read/');
    return response.data;
  },

  /**
   * Delete notification
   * DELETE /api/notifications/{id}/
   */
  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}/`);
  },

  /**
   * Get unread notification count
   * GET /api/notifications/unread_count/
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>(
      '/notifications/unread_count/'
    );
    return response.data;
  },

  /**
   * Connect to WebSocket for real-time notifications
   * WebSocket: ws://localhost:8000/ws/notifications/
   */
  connectWebSocket: (
    token: string,
    onMessage: (notification: Notification) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ): WebSocket => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.hostname}:8000/ws/notifications/?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Notification WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          onMessage(data.notification);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
      if (onError) onError(error);
    };
    
    ws.onclose = () => {
      console.log('Notification WebSocket disconnected');
      if (onClose) onClose();
    };
    
    return ws;
  },
};
