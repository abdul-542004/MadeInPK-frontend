import apiClient from '../lib/apiClient';

/**
 * Order Feedback interface
 */
export interface OrderFeedback {
  id: number;
  order: number;
  order_number: string;
  buyer: number;
  buyer_username: string;
  seller_rating: number;
  seller_comment: string;
  platform_rating: number;
  platform_comment: string;
  communication_rating: number;
  product_as_described: boolean;
  shipping_speed_rating: number;
  created_at: string;
}

/**
 * Product Review interface
 */
export interface ProductReview {
  id: number;
  product: number;
  product_name: string;
  buyer: number;
  buyer_username: string;
  order: number | null;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Create Order Feedback Request
 */
export interface CreateFeedbackRequest {
  order_id: number;
  seller_rating: number; // 1-5
  seller_comment?: string;
  platform_rating: number; // 1-5
  platform_comment?: string;
  communication_rating: number; // 1-5
  product_as_described: boolean;
  shipping_speed_rating: number; // 1-5
}

/**
 * Create Product Review Request
 */
export interface CreateReviewRequest {
  product: number;
  rating: number; // 1-5
  title: string;
  comment: string;
  order?: number; // Optional, for verified purchases
}

/**
 * Review & Feedback Service
 * Handles product reviews and order feedback
 */
export const reviewService = {
  /**
   * Get feedbacks (order reviews)
   * @param orderId - Optional order ID to filter
   */
  getFeedbacks: async (orderId?: number): Promise<OrderFeedback[]> => {
    const params = orderId ? `?order=${orderId}` : '';
    const response = await apiClient.get<PaginatedResponse<OrderFeedback>>(
      `/feedbacks/${params}`
    );
    return response.data.results;
  },

  /**
   * Create order feedback (after delivery)
   * @param feedback - Feedback data
   */
  createFeedback: async (feedback: CreateFeedbackRequest): Promise<OrderFeedback> => {
    const response = await apiClient.post<OrderFeedback>('/feedbacks/', feedback);
    return response.data;
  },

  /**
   * Get product reviews
   * @param productId - Optional product ID to filter
   */
  getProductReviews: async (productId?: number): Promise<ProductReview[]> => {
    const params = productId ? `?product=${productId}` : '';
    const response = await apiClient.get<PaginatedResponse<ProductReview>>(
      `/product-reviews/${params}`
    );
    return response.data.results;
  },

  /**
   * Create product review
   * @param review - Review data
   */
  createProductReview: async (review: CreateReviewRequest): Promise<ProductReview> => {
    const response = await apiClient.post<ProductReview>('/product-reviews/', review);
    return response.data;
  },

  /**
   * Update product review
   * @param reviewId - Review ID
   * @param review - Updated review data
   */
  updateProductReview: async (
    reviewId: number,
    review: Partial<CreateReviewRequest>
  ): Promise<ProductReview> => {
    const response = await apiClient.put<ProductReview>(
      `/product-reviews/${reviewId}/`,
      review
    );
    return response.data;
  },

  /**
   * Delete product review
   * @param reviewId - Review ID
   */
  deleteProductReview: async (reviewId: number): Promise<void> => {
    await apiClient.delete(`/product-reviews/${reviewId}/`);
  },
};
