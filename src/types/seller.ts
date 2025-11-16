// Seller-specific types based on backend API

import { Product, FixedPriceListing } from './product';

export type OrderStatus = 
  | 'pending_payment' 
  | 'payment_failed' 
  | 'paid' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type OrderType = 'fixed_price' | 'auction' | 'cart';

export interface ShippingAddressDetail {
  id: number;
  street_address: string;
  city: number;
  city_name: string;
  province_name: string;
  postal_code: string;
  is_default: boolean;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  seller_id: number;
  seller_username: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  is_shipped: boolean;
  shipped_at: string | null;
}

export interface SellerOrder {
  id: number;
  order_number: string;
  buyer: number;
  buyer_username: string;
  seller: number | null;
  seller_username: string | null;
  product: number | null;
  product_name: string | null;
  order_type: OrderType;
  quantity: number | null;
  unit_price: string | null;
  total_amount: string;
  platform_fee: string;
  seller_amount: string | null;
  shipping_address: number;
  shipping_address_detail: ShippingAddressDetail;
  status: OrderStatus;
  payment_url: string;
  payment_deadline: string;
  items?: OrderItem[];  // For multi-seller orders
  is_multi_seller?: boolean;
  my_items_shipped?: boolean | null;
  all_items_shipped?: boolean | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface SellerStatistics {
  total_sales: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: string;
  current_month_earnings: string;
  total_products: number;
  active_auctions: number;
}

export interface SellerEarnings {
  total_earnings: string;
  pending_earnings: string;
  completed_earnings: string;
  earnings_by_month: Array<{ month: string; amount: string }>;
  product_performance?: Array<{
    id: number;
    name: string;
    total_orders: number;
    total_quantity_sold: number;
    total_revenue: string;
    average_order_value: string;
  }>;
}

// UI representation of seller's product (combines Product and FixedPriceListing)
export interface SellerProductListing {
  id: number; // Product ID
  listingId?: number; // Fixed price listing ID (if exists)
  auctionId?: number; // Auction ID (if exists)
  name: string;
  description: string;
  category: number;
  categoryName: string;
  condition: string;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
  }>;
  listingType: 'auction' | 'fixed_price' | null;
  
  // Fixed price listing fields
  price?: string;
  quantity?: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
  featured?: boolean;
  discount_percentage?: string | null;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  has_active_discount?: boolean;
  current_price?: string;
  
  // Auction fields
  starting_price?: string;
  current_bid?: string;
  auction_status?: string;
  auction_end_time?: string;
  total_bids?: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
}
