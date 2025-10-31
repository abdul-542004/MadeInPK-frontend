import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product, mockProducts } from "../data/mockProducts";
import { wishlistService, WishlistItem } from "../services/wishlistService";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { MOCK_MODE, mockDelay } from "../lib/mockMode";

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: number, notes?: string) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number, productName?: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load wishlist on mount if authenticated
  useEffect(() => {
    if (MOCK_MODE) {
      // In mock mode, load immediately
      refreshWishlist();
    } else if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  const refreshWishlist = async () => {
    if (!isAuthenticated && !MOCK_MODE) return;
    
    try {
      setLoading(true);
      
      if (MOCK_MODE) {
        // Use mock data - load from localStorage
        await mockDelay(100); // Shorter delay
        try {
          const saved = localStorage.getItem('mockWishlist');
          const mockWishlist = saved ? JSON.parse(saved) : [];
          setWishlistItems(mockWishlist);
        } catch (parseError) {
          console.warn('Failed to parse wishlist from localStorage, using empty array');
          localStorage.removeItem('mockWishlist');
          setWishlistItems([]);
        }
      } else {
        const items = await wishlistService.getWishlist();
        setWishlistItems(items);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      setWishlistItems([]);
      if (!MOCK_MODE) {
        toast.error('Failed to load wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: number, notes: string = '') => {
    if (!isAuthenticated && !MOCK_MODE) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      if (MOCK_MODE) {
        // Use mock data
        await mockDelay(200);
        
        // Check if already in wishlist
        if (isInWishlist(productId)) {
          toast.error('Item already in wishlist');
          return;
        }
        
        // Find product in mock data
        const product = mockProducts.find(p => p.id === productId);
        if (!product) {
          toast.error('Product not found');
          return;
        }
        
        // Create mock wishlist item
        const mockItem: WishlistItem = {
          id: Date.now(),
          product: productId,
          product_name: product.name,
          product_image: product.image,
          seller: product.artisan,
          seller_id: 1,
          category: product.category,
          category_id: 1,
          price: { price: product.price.toString() },
          stock_status: product.inStock ? 'in_stock' : 'out_of_stock',
          listing_type: 'fixed_price',
          notes: notes,
          created_at: new Date().toISOString(),
        };
        
        const updated = [mockItem, ...wishlistItems];
        setWishlistItems(updated);
        localStorage.setItem('mockWishlist', JSON.stringify(updated));
        toast.success('Added to wishlist');
      } else {
        const newItem = await wishlistService.addToWishlist(productId, notes);
        setWishlistItems((prev) => [newItem, ...prev]);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      console.error('Failed to add to wishlist:', error);
      if (error.response?.status === 400) {
        toast.error('Item already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!isAuthenticated && !MOCK_MODE) return;

    // Find the wishlist item by product ID
    const item = wishlistItems.find(i => i.product === productId);
    if (!item) return;

    try {
      if (MOCK_MODE) {
        await mockDelay(200);
        const updated = wishlistItems.filter((i) => i.id !== item.id);
        setWishlistItems(updated);
        localStorage.setItem('mockWishlist', JSON.stringify(updated));
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.removeFromWishlist(item.id);
        setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      if (!MOCK_MODE) {
        toast.error('Failed to remove from wishlist');
      }
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.product === productId);
  };

  const toggleWishlist = async (productId: number, productName: string = 'Item') => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
