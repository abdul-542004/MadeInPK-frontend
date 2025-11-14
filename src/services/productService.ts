import apiClient from '../lib/apiClient';
import { 
  Product, 
  Auction,
  Bid, 
  FixedPriceListing,
  PaginatedResponse,
  ProductFilters,
  AuctionFilters,
  Category
} from '../types/product';

/**
 * Product Service
 * Handles product and listing related API calls
 */

export const productService = {
  /**
   * Get product categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/categories/');
    return response.data.results;
  },

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
   * Get single fixed price listing by ID
   */
  getFixedPriceListing: async (id: number): Promise<FixedPriceListing> => {
    const response = await apiClient.get<FixedPriceListing>(`/listings/${id}/`);
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

  /**
   * Place a bid on an auction
   * POST /api/auctions/{id}/place_bid/
   */
  placeBid: async (auctionId: number, amount: number): Promise<Bid> => {
    const response = await apiClient.post<Bid>(
      `/auctions/${auctionId}/place_bid/`,
      { amount }
    );
    return response.data;
  },

  /**
   * Delete a product
   * DELETE /api/products/{id}/
   */
  deleteProduct: async (productId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}/`);
  },

  /**
   * Get auctions by seller
   * GET /api/auctions/?seller={sellerId}
   */
  getSellerAuctions: async (sellerId: number): Promise<Auction[]> => {
    const response = await apiClient.get<PaginatedResponse<Auction>>(
      `/auctions/?seller=${sellerId}`
    );
    return response.data.results;
  },

  /**
   * Create a new auction
   * POST /api/auctions/
   */
  createAuction: async (auctionData: {
    product_id: number;
    starting_price: number;
    start_time: string;
    end_time: string;
  }): Promise<Auction> => {
    const response = await apiClient.post<Auction>('/auctions/', auctionData);
    return response.data;
  },

  /**
   * Create a new product
   * POST /api/products/
   */
  createProduct: async (productData: {
    name: string;
    description: string;
    category: number;
    condition: string;
    images?: File[];
  }): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category', productData.category.toString());
    formData.append('condition', productData.condition);
    
    // Append images if provided
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((imageFile) => {
        formData.append('images', imageFile);
      });
    }
    
    const response = await apiClient.post<Product>('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Add image to an existing product
   * POST /api/products/{id}/add_image/
   */
  addProductImage: async (productId: number, imageFile: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post(
      `/products/${productId}/add_image/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete a product image
   * DELETE /api/products/{productId}/delete_image/{imageId}/
   */
  deleteProductImage: async (productId: number, imageId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}/delete_image/${imageId}/`);
  },

  /**
   * Create a fixed-price listing
   * POST /api/listings/
   */
  createFixedPriceListing: async (listingData: {
    product_id: number;
    price: number;
    quantity: number;
    featured?: boolean;
    discount_percentage?: number;
    discount_start_date?: string;
    discount_end_date?: string;
  }): Promise<FixedPriceListing> => {
    const response = await apiClient.post<FixedPriceListing>('/listings/', listingData);
    return response.data;
  },
};
