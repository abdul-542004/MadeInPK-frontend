import apiClient from '../lib/apiClient';

/**
 * Wishlist item interface from backend
 */
export interface WishlistItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string;
  seller: string;
  seller_id: number;
  category: string;
  category_id: number;
  price: {
    price?: string;
    current_price?: string;
    starting_price?: string;
  };
  stock_status: string;
  listing_type: 'auction' | 'fixed_price';
  notes: string;
  created_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */
export const wishlistService = {
  /**
   * Get all wishlist items for current user
   * @param ordering - Sort field (created_at or -created_at)
   */
  getWishlist: async (ordering: string = '-created_at'): Promise<WishlistItem[]> => {
    const response = await apiClient.get<PaginatedResponse<WishlistItem>>(
      `/wishlist/?ordering=${ordering}`
    );
    return response.data.results;
  },

  /**
   * Add product to wishlist
   * @param productId - Product ID to add
   * @param notes - Optional notes about the product
   */
  addToWishlist: async (productId: number, notes: string = ''): Promise<WishlistItem> => {
    const response = await apiClient.post<WishlistItem>('/wishlist/', {
      product: productId,
      notes,
    });
    return response.data;
  },

  /**
   * Remove product from wishlist
   * @param wishlistItemId - Wishlist item ID (not product ID)
   */
  removeFromWishlist: async (wishlistItemId: number): Promise<void> => {
    await apiClient.delete(`/wishlist/${wishlistItemId}/`);
  },

  /**
   * Update wishlist item notes
   * @param wishlistItemId - Wishlist item ID
   * @param notes - Updated notes
   */
  updateWishlistNotes: async (wishlistItemId: number, notes: string): Promise<WishlistItem> => {
    const response = await apiClient.patch<WishlistItem>(`/wishlist/${wishlistItemId}/`, {
      notes,
    });
    return response.data;
  },
};
