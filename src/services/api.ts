const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('Making request to:', url); // Debug log
      console.log('Request options:', options); // Debug log
      
      const response = await fetch(url, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData); // Debug log
        throw new Error(errorData.error || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService(API_BASE_URL);

// Auction API functions
export interface AuctionListing {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    images: Array<{
      id: number;
      image: string;
      image_url: string;
      is_primary: boolean;
    }>;
    seller_username: string;
    category_name?: string;
    seller_profile?: {
      brand_name?: string;
      is_verified: boolean;
    };
  };
  starting_price: string;
  current_price: string;
  start_time: string;
  end_time: string;
  status: string;
  total_bids: number;
  time_remaining: number;
  latest_bids: Array<{
    id: number;
    bidder_username: string;
    amount: string;
    bid_time: string;
  }>;
}

export const auctionApi = {
  async getActiveAuctions(): Promise<ApiResponse<PaginatedResponse<AuctionListing>>> {
    return apiService.get<PaginatedResponse<AuctionListing>>('/auctions/?status=active');
  },

  async getAuctionDetails(id: number): Promise<ApiResponse<AuctionListing>> {
    return apiService.get<AuctionListing>(`/auctions/${id}/`);
  },
};

// Product interfaces
export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_primary: boolean;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  condition: string;
  seller: number;
  seller_username: string;
  category: number;
  category_name: string;
  images: ProductImage[];
  listing_type: 'fixed_price' | 'auction';
  average_rating?: number;
  total_reviews?: number;
  seller_profile?: {
    brand_name?: string;
    biography?: string;
    is_verified: boolean;
    average_rating?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface FixedPriceListing {
  id: number;
  product: Product;
  price: string;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Product API functions
export const productApi = {
  async getProducts(params?: {
    search?: string;
    category?: number;
    seller?: number;
    condition?: string;
    ordering?: string;
  }): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category.toString());
    if (params?.seller) queryParams.append('seller', params.seller.toString());
    if (params?.condition) queryParams.append('condition', params.condition);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    
    const query = queryParams.toString();
    return apiService.get<Product[]>(`/products/${query ? `?${query}` : ''}`);
  },

  async getProductDetails(id: number): Promise<ApiResponse<Product>> {
    return apiService.get<Product>(`/products/${id}/`);
  },
};

// Fixed Price Listing API functions
export const listingApi = {
  async getListings(params?: {
    status?: string;
    seller?: number;
    category?: number;
    min_price?: number;
    max_price?: number;
  }): Promise<ApiResponse<PaginatedResponse<FixedPriceListing>>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.seller) queryParams.append('seller', params.seller.toString());
    if (params?.category) queryParams.append('category', params.category.toString());
    if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
    
    const query = queryParams.toString();
    return apiService.get<PaginatedResponse<FixedPriceListing>>(`/listings/${query ? `?${query}` : ''}`);
  },

  async getListingDetails(id: number): Promise<ApiResponse<FixedPriceListing>> {
    return apiService.get<FixedPriceListing>(`/listings/${id}/`);
  },
};

// Category interface and API
export interface Category {
  id: number;
  name: string;
  description: string;
  parent?: number;
  subcategories?: Category[];
}

export const categoryApi = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiService.get<Category[]>('/categories/');
  },
};

// Authentication interfaces and API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_seller: boolean;
    seller_profile?: {
      id: number;
      brand_name: string;
      biography: string;
      is_verified: boolean;
    };
  };
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_staff: boolean;
  is_seller: boolean;
  seller_profile?: {
    id: number;
    brand_name: string;
    biography: string;
    is_verified: boolean;
    average_rating: string;
  };
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/login/', credentials);
  },

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/register/', data);
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/logout/', {});
  },

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiService.get<UserProfile>('/auth/profile/');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiService.put<UserProfile>('/auth/profile/', data);
  },
};