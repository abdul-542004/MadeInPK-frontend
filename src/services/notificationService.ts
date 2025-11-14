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
   * POST /api/notifications/{id}/mark_read/
   */
  markAsRead: async (notificationId: number): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
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
};
