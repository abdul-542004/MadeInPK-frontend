import apiClient from '../lib/apiClient';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  User 
} from '../types/auth';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Login user
   * @param credentials - Email and password
   * @returns User data and authentication token
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);
    return response.data;
  },

  /**
   * Register new user
   * @param userData - Registration data
   * @returns User data and authentication token
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register/', userData);
    return response.data;
  },

  /**
   * Logout current user
   * Invalidates the authentication token on the server
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout/');
  },

  /**
   * Get current user profile
   * @returns Current user data with additional profile information
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile/');
    return response.data;
  },

  /**
   * Update current user profile
   * @param data - Partial user data to update
   * @returns Updated user data
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/profile/', data);
    return response.data;
  },

  /**
   * Become a seller
   * @param data - Seller profile data
   * @returns Updated user and seller profile data
   */
  becomeSeller: async (data: {
    brand_name?: string;
    biography?: string;
    business_address_text?: string;  // Legacy text field
    business_address_id?: number;    // New address ID field
    business_phone?: string;
    website?: string;
    social_media_links?: Record<string, string>;
  }): Promise<{
    message: string;
    user: User;
    seller_profile: any;
  }> => {
    const response = await apiClient.post('/auth/become-seller/', data);
    return response.data;
  },
};
