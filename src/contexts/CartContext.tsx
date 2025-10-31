import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../data/mockProducts";
import { orderService, ShippingAddress } from "../services/orderService";
import { MOCK_MODE, mockDelay } from "../lib/mockMode";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  listingId?: number; // Backend listing ID
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number, size?: string, listingId?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  isInCart: (productId: number) => boolean;
  checkout: (shippingAddress: ShippingAddress) => Promise<{ success: boolean; orderId?: number; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount (mock mode)
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
    }
  }, []);

  // Save cart to localStorage when it changes (mock mode)
  useEffect(() => {
    if (MOCK_MODE && cartItems.length > 0) {
      localStorage.setItem('mockCart', JSON.stringify(cartItems));
    } else if (MOCK_MODE && cartItems.length === 0) {
      localStorage.removeItem('mockCart');
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1, size?: string, listingId?: number) => {
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
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (MOCK_MODE) {
      localStorage.removeItem('mockCart');
    }
  };

  const checkout = async (shippingAddress: ShippingAddress): Promise<{ success: boolean; orderId?: number; error?: string }> => {
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
        const mockOrderId = Date.now();
        clearCart();
        return { success: true, orderId: mockOrderId };
      }

      // Real backend checkout
      const orderData = {
        items: cartItems.map(item => ({
          listing_id: item.listingId || item.product.id,
          quantity: item.quantity,
        })),
        shipping_address: shippingAddress,
      };

      const order = await orderService.createOrder(orderData);
      clearCart();
      return { success: true, orderId: order.id };

    } catch (error: any) {
      console.error('Checkout failed:', error);
      const errorMessage = error.response?.data?.message || 'Checkout failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
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
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        isInCart,
        checkout,
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
