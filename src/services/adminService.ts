import apiClient from '../lib/apiClient';
import { User } from '../types/auth';

/**
 * Admin Dashboard related types
 */
export interface AdminStatistics {
  total_users: number;
  total_sellers: number;
  total_products: number;
  total_orders: number;
  total_revenue: string;
  pending_verifications: number;
  active_auctions: number;
  reported_items: number;
}

export interface UserManagement {
  id: number;
  username: string;
  email: string;
  role: string;
  is_blocked: boolean;
  failed_payment_count: number;
  created_at: string;
  total_orders?: number;
  total_spent?: string;
}

export interface ProductOversight {
  id: number;
  name: string;
  seller_username: string;
  category_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  flagged: boolean;
  flag_reason?: string;
}

export interface TransactionData {
  id: number;
  order_number: string;
  buyer_username: string;
  seller_username: string;
  amount: string;
  payment_status: string;
  created_at: string;
}

/**
 * Admin Service
 * Handles admin dashboard and management API calls
 */
export const adminService = {
  /**
   * Get admin dashboard statistics
   * GET /api/admin/statistics/
   */
  getStatistics: async (): Promise<AdminStatistics> => {
    const response = await apiClient.get<AdminStatistics>('/admin/statistics/');
    return response.data;
  },

  /**
   * Get all users for management
   * GET /api/admin/users/
   */
  getUsers: async (filters?: {
    role?: string;
    is_blocked?: boolean;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ count: number; results: UserManagement[] }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/admin/users/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Block/Unblock user
   * POST /api/admin/users/{id}/block/
   * POST /api/admin/users/{id}/unblock/
   */
  blockUser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/admin/users/${userId}/block/`);
    return response.data;
  },

  unblockUser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/admin/users/${userId}/unblock/`);
    return response.data;
  },

  /**
   * Get products for oversight
   * GET /api/admin/products/
   */
  getProducts: async (filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    flagged?: boolean;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ count: number; results: ProductOversight[] }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/admin/products/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Approve product
   * POST /api/admin/products/{id}/approve/
   */
  approveProduct: async (productId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/admin/products/${productId}/approve/`);
    return response.data;
  },

  /**
   * Reject product
   * POST /api/admin/products/{id}/reject/
   */
  rejectProduct: async (
    productId: number,
    reason: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(
      `/admin/products/${productId}/reject/`,
      { reason }
    );
    return response.data;
  },

  /**
   * Get transactions
   * GET /api/admin/transactions/
   */
  getTransactions: async (filters?: {
    payment_status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ count: number; results: TransactionData[] }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/admin/transactions/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Generate reports
   * GET /api/admin/reports/
   */
  generateReport: async (reportType: 'sales' | 'users' | 'products', filters?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> => {
    const params = new URLSearchParams({ report_type: reportType });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(
      `/admin/reports/?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};
