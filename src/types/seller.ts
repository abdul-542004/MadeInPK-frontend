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

export interface SellerOrder {
  id: number;
  order_number: string;
  buyer: number;
  buyer_username: string;
  seller: number;
  seller_username: string;
  product: number;
  product_name: string;
  order_type: OrderType;
  quantity: number;
  unit_price: string;
  total_amount: string;
  platform_fee: string;
  seller_amount: string;
  shipping_address: number;
  shipping_address_detail: ShippingAddressDetail;
  status: OrderStatus;
  payment_url: string;
  payment_deadline: string;
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
  total_products: number;
  active_auctions: number;
}

export interface SellerEarnings {
  total_earnings: string;
  pending_earnings: string;
  completed_earnings: string;
  earnings_by_month: Array<{ month: string; amount: string }>;
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
