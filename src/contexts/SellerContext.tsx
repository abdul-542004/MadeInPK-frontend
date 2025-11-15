import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { productService } from '../services/productService';
import { sellerService } from '../services/sellerService';
import { MOCK_MODE } from '../lib/mockMode';
import { toast } from 'sonner';
import { 
  SellerOrder, 
  SellerProductListing, 
  SellerStatistics,
  OrderStatus 
} from '../types/seller';
import { Product, FixedPriceListing } from '../types/product';
import { useAuth } from './AuthContext';

// Helper function to map category names to IDs
const getCategoryIdByName = (categoryName: string): number => {
  const categoryMapping: Record<string, number> = {
    "Textiles": 1,
    "Handicrafts": 2,
    "Pottery": 3,
    "Jewelry": 4,
    "Home Decor": 5,
    "Carpets": 6,
    "Leather Goods": 7,
    "Woodwork": 8,
  };
  return categoryMapping[categoryName] || 1;
};

// UI-friendly representation for messages and notifications
export interface SellerMessage {
  sender: "customer" | "seller";
  text: string;
  time: string;
}

export interface SellerConversation {
  id: number;
  customer: string;
  lastMessage: string;
  time: string;
  unread: number;
  productImage: string;
  messages: SellerMessage[];
}

export interface SellerNotification {
  id: string;
  type: "order" | "message" | "review" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface SellerContextType {
  products: SellerProductListing[];
  auctions: any[]; // Add auctions array
  orders: SellerOrder[];
  conversations: SellerConversation[];
  notifications: SellerNotification[];
  statistics: SellerStatistics;
  loading: boolean;
  
  // Product management (Fixed-Price Listings)
  loadProducts: () => Promise<void>;
  addProduct: (product: {
    name: string;
    description: string;
    category: string | number;
    condition: string;
    price?: number;
    stock?: number;
    images?: File[];
    featured?: boolean;
    discount_percentage?: number;
    discount_start_date?: string;
    discount_end_date?: string;
  }) => Promise<void>;
  updateProduct: (productId: number, listingId: number, updates: {
    price?: number;
    quantity?: number;
    status?: 'active' | 'inactive';
    discount_percentage?: number | null;
    discount_start_date?: string | null;
    discount_end_date?: string | null;
  }) => Promise<void>;
  toggleProductStatus: (listingId: number) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  
  // Auction management
  loadAuctions: () => Promise<void>;
  addAuction: (auction: {
    name: string;
    description: string;
    category: string | number;
    condition: string;
    starting_price: number;
    duration: string;
    images?: File[];
  }) => Promise<void>;
  deleteAuction: (auctionId: number) => Promise<void>;
  
  // Order management
  loadOrders: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
  markOrderShipped: (orderId: number) => Promise<void>;
  getOrderById: (id: number) => SellerOrder | undefined;
  
  // Messaging
  sendMessage: (conversationId: number, message: string) => void;
  markConversationAsRead: (conversationId: number) => void;
  
  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Statistics
  loadStatistics: () => Promise<void>;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export function SellerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<SellerProductListing[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [conversations, setConversations] = useState<SellerConversation[]>([]);
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);
  const [statistics, setStatistics] = useState<SellerStatistics>({
    total_sales: 0,
    total_orders: 0,
    pending_orders: 0,
    total_revenue: '0.00',
    total_products: 0,
    active_auctions: 0,
  });
  const [loading, setLoading] = useState(false);

  // Load products from backend (Fixed-Price Listings only)
  const loadProducts = async () => {
    if (MOCK_MODE) {
      // Mock data
      setProducts(getMockProducts());
      return;
    }

    try {
      setLoading(true);
      
      // Get all fixed-price listings for this seller
      const listingsResponse = await sellerService.getSellerListings({
        ordering: '-created_at',
        page_size: 100,
      });
      
      // Map listings to SellerProductListing format
      const sellerProducts: SellerProductListing[] = listingsResponse.results.map((listing: FixedPriceListing) => {
        return {
          id: listing.product.id,
          listingId: listing.id,
          name: listing.product.name,
          description: listing.product.description,
          category: listing.product.category,
          categoryName: listing.product.category_name,
          condition: listing.product.condition,
          images: listing.product.images.map(img => ({
            id: img.id,
            image_url: img.image_url || img.image,
            is_primary: img.is_primary,
          })),
          listingType: 'fixed_price',
          
          // Fixed price listing fields
          price: listing.price,
          quantity: listing.quantity,
          status: listing.status,
          featured: listing.featured,
          discount_percentage: listing.discount_percentage,
          discount_start_date: listing.discount_start_date,
          discount_end_date: listing.discount_end_date,
          has_active_discount: listing.has_active_discount,
          current_price: listing.current_price,
          
          created_at: listing.product.created_at,
          updated_at: listing.product.updated_at,
        };
      });
      
      setProducts(sellerProducts);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load auctions from backend
  const loadAuctions = async () => {
    if (MOCK_MODE) {
      // Mock data - filter from stored auctions
      const stored = localStorage.getItem('mock_auctions');
      if (stored) {
        try {
          const allAuctions = JSON.parse(stored);
          setAuctions(allAuctions.filter((a: any) => a.product.seller_username === user?.username));
        } catch {
          setAuctions([]);
        }
      }
      return;
    }

    try {
      setLoading(true);
      
      // Get all auctions for this seller
      const auctionsResponse = await sellerService.getSellerAuctions({
        ordering: '-created_at',
        page_size: 100,
      });
      
      setAuctions(auctionsResponse.results);
    } catch (error: any) {
      console.error('Error loading auctions:', error);
      toast.error(error.response?.data?.message || 'Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  // Load orders from backend
  const loadOrders = async () => {
    if (MOCK_MODE) {
      setOrders(getMockOrders());
      return;
    }

    try {
      setLoading(true);
      const response = await sellerService.getSellerOrders({
        ordering: '-created_at',
        page_size: 100,
      });
      
      setOrders(response.results);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    if (MOCK_MODE) {
      setStatistics(getMockStatistics(orders, products));
      return;
    }

    try {
      const stats = await sellerService.getSellerStatistics();
      setStatistics(stats);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      toast.error(error.response?.data?.message || 'Failed to load statistics');
    }
  };

  // Load data on mount
  useEffect(() => {
    if (user && (user.role === 'seller' || user.role === 'both')) {
      loadProducts();
      loadAuctions();
      loadOrders();
      loadStatistics();
    }
  }, [user]);

  // Add product
  const addProduct = async (productData: {
    name: string;
    description: string;
    category: string | number;
    condition: string;
    price?: number;
    stock?: number;
    images?: File[];
    featured?: boolean;
    discount_percentage?: number;
    discount_start_date?: string;
    discount_end_date?: string;
  }) => {
    if (MOCK_MODE) {
      // Mock mode: convert Files to URLs for display
      const imageUrls = productData.images?.map(file => URL.createObjectURL(file)) || [];
      const newProduct: SellerProductListing = {
        id: Math.floor(Math.random() * 10000),
        name: productData.name,
        description: productData.description,
        category: typeof productData.category === 'string' 
          ? getCategoryIdByName(productData.category) 
          : productData.category,
        categoryName: typeof productData.category === 'string' 
          ? productData.category 
          : 'Unknown',
        condition: productData.condition,
        images: imageUrls.map((url, idx) => ({
          id: idx,
          image_url: url,
          is_primary: idx === 0,
        })),
        listingType: productData.price ? 'fixed_price' : null,
        price: productData.price?.toString(),
        quantity: productData.stock,
        status: (productData.stock && productData.stock > 0) ? 'active' : 'out_of_stock',
        featured: productData.featured || false,
        discount_percentage: productData.discount_percentage?.toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product added successfully!');
      return;
    }

    // Backend mode
    try {
      // Step 1: Create the product
      const categoryId = typeof productData.category === 'string' 
        ? getCategoryIdByName(productData.category) 
        : productData.category;
      
      const createdProduct = await productService.createProduct({
        name: productData.name,
        description: productData.description,
        category: categoryId,
        condition: productData.condition,
        images: productData.images,
      });
      
      // Step 2: If price and stock provided, create a fixed-price listing
      if (productData.price && productData.stock !== undefined) {
        await productService.createFixedPriceListing({
          product_id: createdProduct.id,
          price: productData.price,
          quantity: productData.stock,
          featured: productData.featured,
          discount_percentage: productData.discount_percentage,
          discount_start_date: productData.discount_start_date,
          discount_end_date: productData.discount_end_date,
        });
      }
      
      toast.success('Product created successfully!');
      
      // Reload products
      await loadProducts();
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
      throw error;
    }
  };

  // Update product (updates the fixed-price listing)
  const updateProduct = async (
    productId: number, 
    listingId: number, 
    updates: {
      price?: number;
      quantity?: number;
      status?: 'active' | 'inactive';
    }
  ) => {
    if (MOCK_MODE) {
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            price: updates.price?.toString() || p.price,
            quantity: updates.quantity ?? p.quantity,
            status: updates.status || p.status,
          };
        }
        return p;
      }));
      toast.success('Product updated successfully!');
      return;
    }

    try {
      await sellerService.updateListing(listingId, updates);
      toast.success('Product updated successfully!');
      await loadProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  };

  // Toggle product status
  const toggleProductStatus = async (listingId: number) => {
    if (MOCK_MODE) {
      setProducts(prev => prev.map(p => 
        p.listingId === listingId 
          ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
          : p
      ));
      toast.success('Product status updated!');
      return;
    }

    try {
      const result = await sellerService.toggleListingStatus(listingId);
      toast.success(result.message);
      await loadProducts();
    } catch (error: any) {
      console.error('Error toggling product status:', error);
      toast.error(error.response?.data?.error || 'Failed to update product status');
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (productId: number) => {
    if (MOCK_MODE) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
      return;
    }

    try {
      await sellerService.deleteProduct(productId);
      toast.success('Product deleted successfully!');
      await loadProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  };

  // Add auction
  const addAuction = async (auctionData: {
    name: string;
    description: string;
    category: string | number;
    condition: string;
    starting_price: number;
    duration: string;
    images?: File[];
  }) => {
    if (MOCK_MODE) {
      // Mock mode implementation
      const imageUrls = auctionData.images?.map(file => URL.createObjectURL(file)) || [];
      const newId = Math.max(0, ...auctions.map(a => a.id)) + 1;
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + parseInt(auctionData.duration.split(' ')[0]));

      const newAuction = {
        id: newId,
        product: {
          id: newId,
          name: auctionData.name,
          description: auctionData.description,
          condition: auctionData.condition,
          listing_type: 'auction',
          images: imageUrls.map((url: string, index: number) => ({
            id: index + 1,
            image: url,
            image_url: url,
            is_primary: index === 0,
            order: index
          })),
          seller_username: user?.username || 'seller',
          category_name: typeof auctionData.category === 'string' ? auctionData.category : 'Unknown',
          seller: user?.id || 1,
          category: typeof auctionData.category === 'number' ? auctionData.category : 1,
          average_rating: null,
          total_reviews: 0,
          seller_profile: null,
          region: { id: 1, name: 'Unknown' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        starting_price: auctionData.starting_price.toString(),
        current_price: auctionData.starting_price.toString(),
        start_time: new Date().toISOString(),
        end_time: endTime.toISOString(),
        status: 'active',
        winner: null,
        winner_username: null,
        latest_bids: [],
        total_bids: 0,
        time_remaining: parseInt(auctionData.duration.split(' ')[0]) * 60 * 60,
        created_at: new Date().toISOString(),
      };

      const updatedAuctions = [...auctions, newAuction];
      setAuctions(updatedAuctions);
      
      // Also update localStorage if using mock auctions
      const allStoredAuctions = JSON.parse(localStorage.getItem('mock_auctions') || '[]');
      localStorage.setItem('mock_auctions', JSON.stringify([...allStoredAuctions, newAuction]));
      
      toast.success('Auction created successfully!');
      return;
    }

    // Backend mode - create product first, then auction
    try {
      const categoryId = typeof auctionData.category === 'string' 
        ? getCategoryIdByName(auctionData.category) 
        : auctionData.category;
      
      // Step 1: Create the product
      const createdProduct = await productService.createProduct({
        name: auctionData.name,
        description: auctionData.description,
        category: categoryId,
        condition: auctionData.condition,
        images: auctionData.images,
      });
      
      // Step 2: Create the auction
      const startTime = new Date().toISOString();
      const endTime = new Date(Date.now() + getDurationInMs(auctionData.duration)).toISOString();
      
      await productService.createAuction({
        product_id: createdProduct.id,
        starting_price: auctionData.starting_price,
        start_time: startTime,
        end_time: endTime,
      });
      
      toast.success('Auction created successfully!');
      
      // Reload auctions
      await loadAuctions();
      
    } catch (error: any) {
      console.error('Error creating auction:', error);
      toast.error(error.response?.data?.message || 'Failed to create auction');
      throw error;
    }
  };

  // Helper function to convert duration string to milliseconds
  const getDurationInMs = (duration: string): number => {
    switch (duration) {
      case '24 hours': return 24 * 60 * 60 * 1000;
      case '48 hours': return 48 * 60 * 60 * 1000;
      case '72 hours': return 72 * 60 * 60 * 1000;
      case '1 week': return 7 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  };

  // Delete auction (by deleting the base product)
  const deleteAuction = async (auctionId: number) => {
    if (MOCK_MODE) {
      setAuctions(prev => prev.filter(a => a.id !== auctionId));
      
      // Also update localStorage
      const allStoredAuctions = JSON.parse(localStorage.getItem('mock_auctions') || '[]');
      const updatedStored = allStoredAuctions.filter((a: any) => a.id !== auctionId);
      localStorage.setItem('mock_auctions', JSON.stringify(updatedStored));
      
      toast.success('Auction deleted successfully!');
      return;
    }

    try {
      const auction = auctions.find(a => a.id === auctionId);
      if (!auction) {
        toast.error('Auction not found');
        return;
      }
      
      // Delete the product (which will cascade delete the auction)
      await sellerService.deleteProduct(auction.product.id);
      toast.success('Auction deleted successfully!');
      await loadAuctions();
    } catch (error: any) {
      console.error('Error deleting auction:', error);
      toast.error(error.response?.data?.message || 'Failed to delete auction');
      throw error;
    }
  };

  // Update order status (mark as shipped)
  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    // For now, only 'shipped' status update is supported
    if (status === 'shipped') {
      return markOrderShipped(orderId);
    }
    
    toast.error('Only marking orders as shipped is currently supported');
  };

  // Mark order as shipped
  const markOrderShipped = async (orderId: number) => {
    if (MOCK_MODE) {
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'shipped' as OrderStatus,
            shipped_at: new Date().toISOString(),
          };
        }
        return order;
      }));
      toast.success('Order marked as shipped!');
      return;
    }

    try {
      await sellerService.markOrderShipped(orderId);
      toast.success('Order marked as shipped!');
      await loadOrders();
    } catch (error: any) {
      console.error('Error marking order as shipped:', error);
      toast.error(error.response?.data?.error || 'Failed to mark order as shipped');
      throw error;
    }
  };

  const getOrderById = (id: number) => {
    return orders.find((order) => order.id === id);
  };

  // Message handling (mock for now)
  const sendMessage = (conversationId: number, messageText: string) => {
    setConversations(conversations.map((conv) => {
      if (conv.id === conversationId) {
        const newMessage: SellerMessage = {
          sender: "seller",
          text: messageText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageText,
          time: "Just now",
        };
      }
      return conv;
    }));
  };

  const markConversationAsRead = (conversationId: number) => {
    setConversations(conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unread: 0 } : conv
    ));
  };

  // Notification handling (mock for now)
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <SellerContext.Provider
      value={{
        products,
        auctions,
        orders,
        conversations,
        notifications,
        statistics,
        loading,
        loadProducts,
        addProduct,
        updateProduct,
        toggleProductStatus,
        deleteProduct,
        loadAuctions,
        addAuction,
        deleteAuction,
        loadOrders,
        updateOrderStatus,
        markOrderShipped,
        getOrderById,
        sendMessage,
        markConversationAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        loadStatistics,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

export function useSeller() {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error("useSeller must be used within a SellerProvider");
  }
  return context;
}

// Mock data generators
function getMockProducts(): SellerProductListing[] {
  return [
    {
      id: 1,
      listingId: 1,
      name: "Hand-Embroidered Shawl",
      description: "Beautiful hand-embroidered shawl",
      category: 1,
      categoryName: "Textiles",
      condition: "new",
      images: [{
        id: 1,
        image_url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&h=300&fit=crop",
        is_primary: true,
      }],
      listingType: 'fixed_price',
      price: "3500.00",
      quantity: 12,
      status: 'active',
      featured: false,
      current_price: "3500.00",
      created_at: "2025-09-15T00:00:00Z",
      updated_at: "2025-09-15T00:00:00Z",
    },
    {
      id: 2,
      listingId: 2,
      name: "Blue Pottery Vase Set",
      description: "Authentic blue pottery from Multan",
      category: 3,
      categoryName: "Pottery",
      condition: "new",
      images: [{
        id: 2,
        image_url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300&h=300&fit=crop",
        is_primary: true,
      }],
      listingType: 'fixed_price',
      price: "2800.00",
      quantity: 8,
      status: 'active',
      featured: false,
      current_price: "2800.00",
      created_at: "2025-09-10T00:00:00Z",
      updated_at: "2025-09-10T00:00:00Z",
    },
  ];
}

function getMockOrders(): SellerOrder[] {
  return [
    {
      id: 1,
      order_number: "FXD-ABC123",
      buyer: 10,
      buyer_username: "ahmed_khan",
      seller: 5,
      seller_username: "seller1",
      product: 1,
      product_name: "Hand-Embroidered Shawl",
      order_type: 'fixed_price',
      quantity: 2,
      unit_price: "3500.00",
      total_amount: "7000.00",
      platform_fee: "140.00",
      seller_amount: "6860.00",
      shipping_address: 1,
      shipping_address_detail: {
        id: 1,
        street_address: "123 Main St",
        city: 1,
        city_name: "Karachi",
        province_name: "Sindh",
        postal_code: "75500",
        is_default: true,
      },
      status: 'paid',
      payment_url: "",
      payment_deadline: "2025-11-15T00:00:00Z",
      created_at: "2025-11-14T10:00:00Z",
      paid_at: "2025-11-14T10:30:00Z",
      shipped_at: null,
      delivered_at: null,
    },
  ];
}

function getMockStatistics(orders: SellerOrder[], products: SellerProductListing[]): SellerStatistics {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'paid').length;
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + parseFloat(o.seller_amount), 0);
  
  return {
    total_sales: totalOrders,
    total_orders: totalOrders,
    pending_orders: pendingOrders,
    total_revenue: totalRevenue.toFixed(2),
    total_products: products.length,
    active_auctions: 0,
  };
}
