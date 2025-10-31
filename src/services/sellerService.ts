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
   * GET /api/seller/orders/
   */
  getSellerOrders: async (filters?: {
    status?: string;
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
      `/seller/orders/?${params.toString()}`
    );
    return response.data;
  },
};
