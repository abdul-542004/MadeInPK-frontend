import apiClient from '../lib/apiClient';
import { SellerProfile } from '../types/auth';

/**
 * Seller Profile Service
 * Handles seller profile related API calls
 */

export interface CreateSellerProfileRequest {
  brand_name: string;
  biography: string;
  business_address: string;
  website?: string;
  social_media_links?: Record<string, string>;
}

export interface UpdateSellerProfileRequest extends Partial<CreateSellerProfileRequest> {}

export const sellerService = {
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
  getSellerEarnings: async (filters?: {
    start_date?: string;
    end_date?: string;
    status?: string;
  }): Promise<{
    total_earnings: string;
    pending_earnings: string;
    completed_earnings: string;
    earnings_by_month: Array<{ month: string; amount: string }>;
  }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/seller/earnings/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get seller's orders
   * GET /api/orders/?role=seller
   */
  getSellerOrders: async (filters?: {
    status?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<any> => {
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
    return response.data;
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
   * Delete a product
   * DELETE /api/products/{id}/
   */
  deleteProduct: async (productId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}/`);
  },
};
