import apiClient from '../lib/apiClient';

/**
 * Complaint interface
 */
export interface Complaint {
  id: number;
  complaint_number: string;
  user: number;
  user_username: string;
  category: 'payment' | 'seller' | 'product' | 'platform' | 'shipping' | 'other';
  subject: string;
  description: string;
  order: number | null;
  order_number: string | null;
  seller: number | null;
  seller_username: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

/**
 * Create Complaint Request
 */
export interface CreateComplaintRequest {
  category: 'payment' | 'seller' | 'product' | 'platform' | 'shipping' | 'other';
  subject: string;
  description: string;
  order?: number;
  seller?: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Complaint Service
 * Handles user complaints about orders, sellers, products, etc.
 */
export const complaintService = {
  /**
   * Get user's complaints
   */
  getMyComplaints: async (): Promise<Complaint[]> => {
    const response = await apiClient.get<PaginatedResponse<Complaint>>('/complaints/');
    return response.data.results;
  },

  /**
   * Get single complaint details
   * @param complaintId - Complaint ID
   */
  getComplaint: async (complaintId: number): Promise<Complaint> => {
    const response = await apiClient.get<Complaint>(`/complaints/${complaintId}/`);
    return response.data;
  },

  /**
   * Create a new complaint
   * @param complaint - Complaint data
   */
  createComplaint: async (complaint: CreateComplaintRequest): Promise<Complaint> => {
    const response = await apiClient.post<Complaint>('/complaints/', complaint);
    return response.data;
  },

  /**
   * Get complaint categories
   */
  getCategories: () => [
    { value: 'payment', label: 'Payment Issue' },
    { value: 'seller', label: 'Seller Issue' },
    { value: 'product', label: 'Product Issue' },
    { value: 'platform', label: 'Platform Issue' },
    { value: 'shipping', label: 'Shipping Issue' },
    { value: 'other', label: 'Other' },
  ],
};
