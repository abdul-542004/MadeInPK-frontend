import apiClient from '../lib/apiClient';
import { 
  Product, 
  Auction, 
  FixedPriceListing,
  PaginatedResponse,
  ProductFilters,
  AuctionFilters
} from '../types/product';

/**
 * Product Service
 * Handles product and listing related API calls
 */

export const productService = {
  /**
   * Get list of products with optional filters
   */
  getProducts: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get single product details
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}/`);
    return response.data;
  },

  /**
   * Get list of auctions with optional filters
   */
  getAuctions: async (filters?: AuctionFilters): Promise<PaginatedResponse<Auction>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<Auction>>(
      `/auctions/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get single auction details
   */
  getAuction: async (id: number): Promise<Auction> => {
    const response = await apiClient.get<Auction>(`/auctions/${id}/`);
    return response.data;
  },

  /**
   * Get fixed price listings
   */
  getFixedPriceListings: async (filters?: ProductFilters): Promise<PaginatedResponse<FixedPriceListing>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<FixedPriceListing>>(
      `/listings/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get featured products (featured fixed price listings only)
   */
  getFeaturedProducts: async (limit: number = 8): Promise<FixedPriceListing[]> => {
    const params = new URLSearchParams({
      featured: 'true',
      status: 'active',
      ordering: '-created_at',
      page_size: limit.toString(),
    });
    
    const response = await apiClient.get<PaginatedResponse<FixedPriceListing>>(
      `/listings/?${params.toString()}`
    );
    return response.data.results;
  },

  /**
   * Get newly listed auctions (active auctions sorted by creation date)
   */
  getNewAuctions: async (limit: number = 6): Promise<Auction[]> => {
    const response = await productService.getAuctions({
      status: 'active',
      ordering: '-created_at',
      page_size: limit,
    });
    return response.results;
  },
};
