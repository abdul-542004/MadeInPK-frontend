import apiClient from '../lib/apiClient';

/**
 * Address and Location related types
 */
export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province: number;
  province_name: string;
}

export interface Address {
  id: number;
  user: number;
  street_address: string;
  city: number;
  city_name: string;
  province_name: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
}

export interface CreateAddressRequest {
  street_address: string;
  city: number;
  postal_code: string;
  is_default?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

/**
 * Address Service
 * Handles all address and location related API calls
 */
export const addressService = {
  /**
   * Get list of provinces
   * GET /api/provinces/
   */
  getProvinces: async (): Promise<Province[]> => {
    const response = await apiClient.get('/provinces/');
    const data = response.data;
    if (Array.isArray(data)) {
      return data as Province[];
    }
    if (data?.results && Array.isArray(data.results)) {
      return data.results as Province[];
    }
    return [];
  },

  /**
   * Get list of cities (optionally filtered by province)
   * GET /api/cities/?province={id}
   */
  getCities: async (provinceId?: number): Promise<City[]> => {
    const url = provinceId 
      ? `/cities/?province=${provinceId}` 
      : '/cities/';
    const response = await apiClient.get(url);
    const data = response.data;
    
    // Handle both direct array and paginated response
    if (Array.isArray(data)) {
      return data as City[];
    }
    if (data?.results && Array.isArray(data.results)) {
      return data.results as City[];
    }
    return [];
  },

  /**
   * Get all addresses for current user
   * GET /api/addresses/
   */
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get('/addresses/');
    const data = response.data;
    
    // Handle both direct array and paginated response
    if (Array.isArray(data)) {
      return data as Address[];
    }
    if (data?.results && Array.isArray(data.results)) {
      return data.results as Address[];
    }
    return [];
  },

  /**
   * Create new address
   * POST /api/addresses/
   */
  createAddress: async (data: CreateAddressRequest): Promise<Address> => {
    const response = await apiClient.post<Address>('/addresses/', data);
    return response.data;
  },

  /**
   * Update existing address
   * PUT /api/addresses/{id}/
   */
  updateAddress: async (
    addressId: number,
    data: UpdateAddressRequest
  ): Promise<Address> => {
    const response = await apiClient.put<Address>(
      `/addresses/${addressId}/`,
      data
    );
    return response.data;
  },

  /**
   * Delete address
   * DELETE /api/addresses/{id}/
   */
  deleteAddress: async (addressId: number): Promise<void> => {
    await apiClient.delete(`/addresses/${addressId}/`);
  },

  /**
   * Set address as default
   * POST /api/addresses/{id}/set_default/
   */
  setDefaultAddress: async (addressId: number): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/addresses/${addressId}/set_default/`
    );
    return response.data;
  },
};
