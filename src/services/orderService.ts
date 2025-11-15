import apiClient from '../lib/apiClient';

/**
 * Order and Purchase related types
 */
export interface ShippingAddressDetail {
  id: number;
  street_address: string;
  city_name: string;
  province_name: string;
  postal_code: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  buyer: number;
  buyer_username: string;
  seller: number | null;
  seller_username: string | null;
  product: number | null;
  product_name: string | null;
  order_type: 'auction' | 'fixed_price' | 'cart';
  quantity: number | null;
  unit_price: string | null;
  total_amount: string;
  platform_fee: string;
  seller_amount: string | null;
  shipping_address: number;
  shipping_address_detail: ShippingAddressDetail;
  status: 'pending_payment' | 'payment_failed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_url: string;
  payment_deadline: string | null;
  items?: OrderItem[];
  is_multi_seller: boolean;
  stripe_payment_intent_id: string;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface CreateOrderRequest {
  items: Array<{
    listing_id: number;
    quantity: number;
  }>;
  shipping_address_id: number;
  payment_method?: string;
}

export interface PurchaseListingRequest {
  quantity: number;
  shipping_address_id: number;
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
   * GET /api/orders/?role=buyer (for buyer's purchases)
   */
  getOrders: async (filters?: {
    status?: string;
    ordering?: string;
    role?: 'buyer' | 'seller';
  }): Promise<Order[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<Order> | Order[]>(
      `/orders/?${params.toString()}`
    );
    
    // Handle both paginated response and direct array
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && 'results' in response.data) {
      return response.data.results;
    }
    return [];
  },

  /**
   * Get buyer's orders (purchases)
   * GET /api/orders/?role=buyer
   */
  getBuyerOrders: async (filters?: {
    status?: string;
    ordering?: string;
  }): Promise<Order[]> => {
    return orderService.getOrders({ ...filters, role: 'buyer' });
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
   * Mark order as delivered (Buyer only)
   * POST /api/orders/{id}/mark_delivered/
   */
  markDelivered: async (orderId: number): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
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
