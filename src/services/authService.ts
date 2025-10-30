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
};
