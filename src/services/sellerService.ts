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
};
