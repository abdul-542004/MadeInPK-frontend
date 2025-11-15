import apiClient from '../lib/apiClient';
import { SellerProfile } from '../types/auth';

/**
 * Seller Profile Service
 * Handles seller profile related API calls
 */

export interface CreateSellerProfileRequest {
  brand_name: string;
  biography: string;
  business_address?: string;  // Legacy text field
  business_address_id?: number | null;  // New address ID
  business_phone?: string;
  website?: string;
  social_media_links?: Record<string, string>;
}

export interface UpdateSellerProfileRequest extends Partial<CreateSellerProfileRequest> {
  business_phone?: string;
}

export const sellerService = {
  /**
   * Get current user's seller profile
   * GET /api/seller-profiles/
   */
  getMySellerProfile: async (): Promise<SellerProfile> => {
    const response = await apiClient.get('/seller-profiles/');
    // Returns array of seller profiles for current user
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
      return data.results[0];
    }
    throw new Error('Seller profile not found');
  },

  /**
   * Get seller profile by ID
   * @param id - Seller profile ID
   * @returns Seller profile data
   */
  getSellerProfile: async (id: number): Promise<SellerProfile> => {
    const response = await apiClient.get<SellerProfile>(`/seller-profiles/${id}/`);
    return response.data;
  },

  /**
   * Create seller profile (requires seller role)
   * @param data - Seller profile data
   * @returns Created seller profile
   */
  createSellerProfile: async (data: CreateSellerProfileRequest): Promise<SellerProfile> => {
    const response = await apiClient.post<SellerProfile>('/seller-profiles/', data);
    return response.data;
  },

  /**
   * Update seller profile
   * @param id - Seller profile ID
   * @param data - Updated seller profile data
   * @returns Updated seller profile
   */
  updateSellerProfile: async (
    id: number,
    data: UpdateSellerProfileRequest
  ): Promise<SellerProfile> => {
    const response = await apiClient.patch<SellerProfile>(`/seller-profiles/${id}/`, data);
    return response.data;
  },

  /**
   * Verify seller (admin only)
   * @param id - Seller profile ID
   */
  verifySeller: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/seller-profiles/${id}/verify/`
    );
    return response.data;
  },

  /**
   * Get seller statistics and analytics
   * GET /api/seller/statistics/
   */
  getSellerStatistics: async (): Promise<{
    total_sales: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: string;
    total_products: number;
    active_auctions: number;
  }> => {
    const response = await apiClient.get('/seller/statistics/');
    return response.data;
  },

  /**
   * Get seller earnings breakdown
   * GET /api/seller/earnings/
   */
  getSellerEarnings: async (): Promise<{
    current_month: string;
    last_month: string;
    total_earnings: string;
    pending_payouts: string;
    earnings_by_month: Array<{ month: string; amount: string; earnings: number }>;
    earnings_by_week: Array<{ name: string; amount: string; earnings: number }>;
    earnings_by_quarter: Array<{ name: string; amount: string; earnings: number }>;
    earnings_by_year: Array<{ name: string; amount: string; earnings: number }>;
  }> => {
    const response = await apiClient.get('/seller/earnings/');
    return response.data;
  },

  /**
   * Get seller transaction history
   * GET /api/seller/transactions/
   */
  getSellerTransactions: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<{
    transactions: Array<{
      id: string;
      description: string;
      date: string;
      amount: string;
      status: string;
      status_color: string;
      order_id: number;
    }>;
    total: number;
    limit: number;
    offset: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const response = await apiClient.get(
      `/seller/transactions/?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get product performance statistics
   * GET /api/seller/product-performance/
   */
  getProductPerformance: async (): Promise<{
    products: Array<{
      name: string;
      sales: number;
      revenue: string;
    }>;
  }> => {
    const response = await apiClient.get('/seller/product-performance/');
    return response.data;
  },

  /**
   * Get seller's orders
   * GET /api/orders/?role=seller
   */
  getSellerOrders: async (filters?: {
    status?: string;
    ordering?: string;
  }): Promise<{
    results: Array<{
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
      shipping_address_detail: {
        id: number;
        street_address: string;
        city_name: string;
        province_name: string;
        postal_code: string;
      };
      status: 'pending_payment' | 'payment_failed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
      created_at: string;
      paid_at: string | null;
      shipped_at: string | null;
      delivered_at: string | null;
      items?: Array<{
        id: number;
        product_name: string;
        quantity: number;
        unit_price: string;
        subtotal: string;
      }>;
    }>;
    count: number;
  }> => {
    const params = new URLSearchParams();
    params.append('role', 'seller');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/orders/?${params.toString()}`
    );
    
    // Backend returns array directly, not paginated
    const data = response.data;
    return {
      results: Array.isArray(data) ? data : data.results || [],
      count: Array.isArray(data) ? data.length : data.count || 0
    };
  },

  /**
   * Mark order as shipped
   * POST /api/orders/{id}/mark_shipped/
   */
  markOrderShipped: async (orderId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/orders/${orderId}/mark_shipped/`);
    return response.data;
  },

  /**
   * Get seller's products (products created by the seller)
   * GET /api/products/?seller={sellerId}
   */
  getSellerProducts: async (filters?: {
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<any> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/products/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get seller's fixed-price listings
   * GET /api/listings/?my_listings=true
   */
  getSellerListings: async (filters?: {
    status?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<any> => {
    const params = new URLSearchParams();
    params.append('my_listings', 'true'); // Filter for current user's listings
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/listings/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get seller's auctions
   * GET /api/auctions/?my_auctions=true
   */
  getSellerAuctions: async (filters?: {
    status?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<any> => {
    const params = new URLSearchParams();
    params.append('my_auctions', 'true'); // Filter for current user's auctions
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/auctions/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Update a fixed-price listing
   * PATCH /api/listings/{id}/
   */
  updateListing: async (listingId: number, data: {
    price?: number;
    quantity?: number;
    status?: 'active' | 'inactive';
    discount_percentage?: number | null;
    discount_start_date?: string | null;
    discount_end_date?: string | null;
  }): Promise<any> => {
    const response = await apiClient.patch(`/listings/${listingId}/`, data);
    return response.data;
  },

  /**
   * Toggle listing status (activate/deactivate)
   * POST /api/listings/{id}/toggle_status/
   */
  toggleListingStatus: async (listingId: number): Promise<{
    message: string;
    status: 'active' | 'inactive';
  }> => {
    const response = await apiClient.post(`/listings/${listingId}/toggle_status/`);
    return response.data;
  },

  /**
   * Delete a product
   * DELETE /api/products/{id}/
   */
  deleteProduct: async (productId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}/`);
  },
};
