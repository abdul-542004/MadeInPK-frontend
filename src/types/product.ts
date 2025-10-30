// Product and Listing related types based on backend API

export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_primary: boolean;
  order: number;
}

export interface SellerProfileSummary {
  brand_name: string;
  biography: string;
  is_verified: boolean;
  average_rating: string;
}

export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
export type ListingType = 'auction' | 'fixed_price';

export interface Product {
  id: number;
  seller: number;
  seller_username: string;
  category: number;
  category_name: string;
  name: string;
  description: string;
  condition: ProductCondition;
  images: ProductImage[];
  listing_type: ListingType;
  average_rating: number | null;
  total_reviews: number;
  seller_profile: SellerProfileSummary | null;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: number;
  bidder: number;
  bidder_username: string;
  amount: string;
  bid_time: string;
  is_winning: boolean;
}

export type AuctionStatus = 'active' | 'ended' | 'cancelled' | 'completed';

export interface Auction {
  id: number;
  product: Product;
  starting_price: string;
  current_price: string;
  start_time: string;
  end_time: string;
  status: AuctionStatus;
  winner: number | null;
  winner_username: string | null;
  latest_bids: Bid[];
  total_bids: number;
  time_remaining: number;
  created_at: string;
}

export interface FixedPriceListing {
  id: number;
  product: Product;
  price: string;
  quantity: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductFilters {
  seller?: number;
  category?: number;
  condition?: ProductCondition;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface AuctionFilters {
  status?: AuctionStatus;
  seller?: number;
  category?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
