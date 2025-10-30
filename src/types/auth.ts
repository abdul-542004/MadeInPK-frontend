// Authentication related types based on backend API documentation

export type UserRole = 'buyer' | 'seller' | 'both' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  profile_picture: string | null;
  profile_picture_url: string | null;
  role: UserRole;
  is_blocked: boolean;
  failed_payment_count: number;
  created_at: string;
  total_sales?: number;
  total_purchases?: number;
  average_seller_rating?: number | null;
  seller_profile?: SellerProfile | null;
}

export interface SellerProfile {
  id: number;
  user: number;
  user_username: string;
  user_email: string;
  brand_name: string;
  biography: string;
  business_address: string;
  website: string | null;
  social_media_links: Record<string, string>;
  is_verified: boolean;
  average_rating: string;
  total_feedbacks: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: UserRole;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface AuthError {
  [key: string]: string[] | string;
}
