import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../data/mockProducts";
import { cartService, Cart as BackendCart, CartItem as BackendCartItem, CheckoutResponse } from "../services/cartService";
import { MOCK_MODE, mockDelay } from "../lib/mockMode";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Frontend cart item interface (for mock mode and display)
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  listingId?: number; // Backend listing ID
  cartItemId?: number; // Backend cart item ID
  availableQuantity?: number; // Available stock quantity from backend
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  backendCart: BackendCart | null;
  addToCart: (product: Product, quantity?: number, size?: string, listingId?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => number;
  getCartTotal: () => number;
  isInCart: (productId: number) => boolean;
  checkout: (shippingAddressId: number) => Promise<{ success: boolean; order?: CheckoutResponse; error?: string }>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [backendCart, setBackendCart] = useState<BackendCart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart on mount
  useEffect(() => {
    if (MOCK_MODE) {
      try {
        const saved = localStorage.getItem('mockCart');
        if (saved) {
          setCartItems(JSON.parse(saved));
        }
      } catch (error) {
        console.warn('Failed to load cart from localStorage');
        localStorage.removeItem('mockCart');
      }
    } else if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  // Save cart to localStorage when it changes (mock mode only)
  useEffect(() => {
    if (MOCK_MODE && cartItems.length > 0) {
      localStorage.setItem('mockCart', JSON.stringify(cartItems));
    } else if (MOCK_MODE && cartItems.length === 0) {
      localStorage.removeItem('mockCart');
    }
  }, [cartItems]);

  // Convert backend cart items to frontend format
  const convertBackendCartToFrontend = (backendCart: BackendCart): CartItem[] => {
    return backendCart.items.map((item: BackendCartItem) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.unit_price),
        image: item.product.images.find(img => img.is_primary)?.image || item.product.images[0]?.image || '',
        rating: 4.5, // Default rating
        artisan: item.seller_username,
        category: item.product.category_name,
        description: item.product.description,
        inStock: item.is_available,
      } as Product,
      quantity: item.quantity,
      listingId: item.listing_id,
      cartItemId: item.id,
      availableQuantity: item.available_quantity,
    }));
  };

  const refreshCart = async () => {
    if (!isAuthenticated || MOCK_MODE) return;

    try {
      setLoading(true);
      const cart = await cartService.getCart();
      setBackendCart(cart);
      setCartItems(convertBackendCartToFrontend(cart));
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      // Don't show error toast on initial load, just log it
      if (error.response?.status !== 404) {
        console.warn('Cart fetch error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity = 1, size?: string, listingId?: number) => {
    if (!listingId) {
      toast.error('Cannot add to cart: listing ID is required');
      return;
    }

    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(300);
        setCartItems((prev) => {
          const existingItem = prev.find((item) => item.product.id === product.id);
          
          if (existingItem) {
            toast.success(`Updated quantity in cart`);
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          
          toast.success('Added to cart');
          return [...prev, { product, quantity, size, listingId }];
        });
      } else {
        // Use backend API
        await cartService.addToCart({ listing_id: listingId, quantity });
        toast.success('Added to cart');
        await refreshCart();
      }
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.non_field_errors?.[0] ||
                      error.response?.data?.quantity?.[0] ||
                      'Failed to add to cart';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    const item = cartItems.find(i => i.product.id === productId);
    
    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(200);
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
        toast.success('Item removed from cart');
      } else {
        if (!item?.cartItemId) {
          toast.error('Cannot remove item: invalid cart item');
          return;
        }
        await cartService.removeCartItem(item.cartItemId);
        toast.success('Item removed from cart');
        await refreshCart();
      }
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const item = cartItems.find(i => i.product.id === productId);
    
    try {
      setLoading(true);

      if (MOCK_MODE) {
        await mockDelay(200);
        setCartItems((prev) =>
          prev.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        );
      } else {
        if (!item?.cartItemId) {
          toast.error('Cannot update quantity: invalid cart item');
          return;
        }
        await cartService.updateCartItem(item.cartItemId, { quantity });
        await refreshCart();
      }
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      const errorMsg = error.response?.data?.quantity?.[0] || 'Failed to update quantity';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);

      if (MOCK_MODE) {
        setCartItems([]);
        localStorage.removeItem('mockCart');
      } else {
        await cartService.clearCart();
        setCartItems([]);
        setBackendCart(null);
      }
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (shippingAddressId: number): Promise<{ success: boolean; order?: CheckoutResponse; error?: string }> => {
    if (!isAuthenticated && !MOCK_MODE) {
      return { success: false, error: 'Please login to checkout' };
    }

    if (cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    try {
      setLoading(true);

      if (MOCK_MODE) {
        // Mock checkout
        await mockDelay(1000);
        await clearCart();
        return { success: true };
      }

      // Real backend checkout
      const order = await cartService.checkout({ shipping_address_id: shippingAddressId });
      
      // Don't clear cart here - backend does it automatically
      setCartItems([]);
      setBackendCart(null);
      
      return { success: true, order };

    } catch (error: any) {
      console.error('Checkout failed:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.non_field_errors?.[0] ||
                          error.response?.data?.shipping_address_id?.[0] ||
                          'Checkout failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () => {
    if (!MOCK_MODE && backendCart) {
      return backendCart.total_items;
    }
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!MOCK_MODE && backendCart) {
      return parseFloat(backendCart.total_price);
    }
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const isInCart = (productId: number) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        backendCart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        isInCart,
        checkout,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
