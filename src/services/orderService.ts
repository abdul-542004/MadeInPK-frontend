import apiClient from '../lib/apiClient';

/**
 * Order and Purchase related types
 */
export interface ShippingAddress {
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface OrderItem {
  id: number;
  listing: number;
  listing_title: string;
  listing_image: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  buyer: number;
  buyer_username: string;
  items: OrderItem[];
  total_amount: string;
  shipping_address: ShippingAddress;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  shipped_at?: string;
  delivered_at?: string;
}

export interface CreateOrderRequest {
  items: Array<{
    listing_id: number;
    quantity: number;
  }>;
  shipping_address: ShippingAddress;
  payment_method?: string;
}

export interface PurchaseListingRequest {
  quantity: number;
  shipping_address: ShippingAddress;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Order Service
 * Handles all order and purchase related API calls
 */
export const orderService = {
  /**
   * Create a new order
   * POST /api/orders/
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders/', data);
    return response.data;
  },

  /**
   * Get list of orders for current user
   * GET /api/orders/
   */
  getOrders: async (filters?: {
    status?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/orders/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get single order details
   * GET /api/orders/{id}/
   */
  getOrderDetails: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}/`);
    return response.data;
  },

  /**
   * Mark order as shipped (Seller only)
   * POST /api/orders/{id}/mark_shipped/
   */
  markShipped: async (orderId: number): Promise<Order> => {
    const response = await apiClient.post<Order>(
      `/orders/${orderId}/mark_shipped/`
    );
    return response.data;
  },

  /**
   * Mark order as delivered (Seller only)
   * POST /api/orders/{id}/mark_delivered/
   */
  markDelivered: async (orderId: number): Promise<Order> => {
    const response = await apiClient.post<Order>(
      `/orders/${orderId}/mark_delivered/`
    );
    return response.data;
  },

  /**
   * Purchase a fixed-price listing directly
   * POST /api/listings/{id}/purchase/
   */
  purchaseListing: async (
    listingId: number,
    data: PurchaseListingRequest
  ): Promise<Order> => {
    const response = await apiClient.post<Order>(
      `/listings/${listingId}/purchase/`,
      data
    );
    return response.data;
  },

  /**
   * Get order statistics for seller
   * GET /api/seller/statistics/
   */
  getSellerStatistics: async (): Promise<{
    total_sales: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: string;
  }> => {
    const response = await apiClient.get('/seller/statistics/');
    return response.data;
  },
};
