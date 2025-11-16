import apiClient from '../lib/apiClient';

/**
 * Cart related types based on backend API
 */
export interface CartItemProduct {
  id: number;
  seller: number;
  seller_username: string;
  category: number;
  category_name: string;
  name: string;
  description: string;
  condition: string;
  images: Array<{
    id: number;
    image: string;
    is_primary: boolean;
  }>;
  listing_type: string;
}

export interface CartItem {
  id: number;
  listing_id: number;
  product: CartItemProduct;
  quantity: number;
  unit_price: string;
  subtotal: string;
  is_available: boolean;
  available_quantity: number;
  seller_id: number;
  seller_username: string;
  added_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: string;
  sellers: Array<{
    id: number;
    username: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  listing_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CheckoutRequest {
  shipping_address_id: number;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  seller_id: number;
  seller_username: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  created_at: string;
}

export interface ShippingAddressDetail {
  id: number;
  street_address: string;
  city: number;
  city_name: string;
  province_name: string;
  postal_code: string;
  is_default: boolean;
}

export interface CheckoutResponse {
  id: number;
  order_number: string;
  buyer: number;
  buyer_username: string;
  seller: number | null;
  seller_username: string | null;
  product: number | null;
  product_name: string | null;
  order_type: 'cart' | 'fixed_price' | 'auction';
  quantity: number | null;
  unit_price: string | null;
  total_amount: string;
  platform_fee: string;
  seller_amount: string | null;
  shipping_address: number;
  shipping_address_detail: ShippingAddressDetail;
  status: 'pending_payment' | 'payment_failed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_url: string;
  payment_deadline: string;
  items: OrderItem[];
  is_multi_seller: boolean;
  stripe_payment_intent_id: string | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

/**
 * Cart Service
 * Handles all shopping cart related API calls
 */
export const cartService = {
  /**
   * Get user's cart
   * GET /api/cart/
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart/');
    return response.data;
  },

  /**
   * Add item to cart
   * POST /api/cart/add_item/
   */
  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>('/cart/add_item/', data);
    return response.data;
  },

  /**
   * Update cart item quantity
   * PATCH /api/cart/items/{item_id}/
   */
  updateCartItem: async (itemId: number, data: UpdateCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.patch<CartItem>(`/cart/items/${itemId}/`, data);
    return response.data;
  },

  /**
   * Remove item from cart
   * DELETE /api/cart/items/{item_id}/
   */
  removeCartItem: async (itemId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/cart/items/${itemId}/`);
    return response.data;
  },

  /**
   * Clear cart
   * POST /api/cart/clear/
   */
  clearCart: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/cart/clear/');
    return response.data;
  },

  /**
   * Checkout cart
   * POST /api/cart/checkout/
   */
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await apiClient.post<CheckoutResponse>('/cart/checkout/', data);
    return response.data;
  },
};
