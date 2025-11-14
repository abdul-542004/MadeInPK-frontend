import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { productService } from '../services/productService';
import { messagingService, Conversation as ApiConversation, Message } from '../services/messagingService';
import { MOCK_MODE } from '../lib/mockMode';
import { toast } from 'sonner';

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
  return categoryMapping[categoryName] || 1; // Default to Textiles
};

export interface SellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Out of Stock" | "Low Stock" | "Inactive";
  statusColor: string;
  image: string;
  sales: number;
  description?: string;
  material?: string;
  origin?: string;
  dimensions?: {
    length?: number;
    width?: number;
    weight?: number;
  };
  images?: string[];
  createdAt: string;
}

export interface SellerOrder {
  id: string;
  customer: string;
  customerEmail?: string;
  productName: string;
  productId: string;
  quantity: number;
  total: string;
  totalAmount: number;
  date: string;
  status: "Pending" | "Processing" | "Ready to Ship" | "Shipped" | "Delivered" | "Cancelled";
  statusColor: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

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
  products: SellerProduct[];
  orders: SellerOrder[];
  conversations: SellerConversation[];
  notifications: SellerNotification[];
  addProduct: (product: Omit<SellerProduct, "id" | "sales" | "createdAt" | "status" | "statusColor">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: SellerOrder["status"]) => void;
  sendMessage: (conversationId: number, message: string) => void;
  markConversationAsRead: (conversationId: number) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getProductById: (id: string) => SellerProduct | undefined;
  getOrderById: (id: string) => SellerOrder | undefined;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export function SellerProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<SellerProduct[]>([
    {
      id: "1",
      name: "Hand-Embroidered Shawl",
      category: "Textiles",
      price: 3500,
      stock: 12,
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&h=300&fit=crop",
      sales: 45,
      description: "Beautiful hand-embroidered shawl made with traditional Pakistani craftsmanship",
      material: "Pashmina Wool",
      origin: "Multan",
      createdAt: "2025-09-15",
    },
    {
      id: "2",
      name: "Blue Pottery Vase Set",
      category: "Pottery",
      price: 2800,
      stock: 8,
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700",
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300&h=300&fit=crop",
      sales: 32,
      description: "Authentic blue pottery from Multan",
      material: "Clay",
      origin: "Multan",
      createdAt: "2025-09-10",
    },
    {
      id: "3",
      name: "Brass Candle Holders",
      category: "Metalwork",
      price: 1900,
      stock: 0,
      status: "Out of Stock",
      statusColor: "bg-red-100 text-red-700",
      image: "https://images.unsplash.com/photo-1602874801006-94d67b8d6e2c?w=300&h=300&fit=crop",
      sales: 28,
      description: "Traditional brass candle holders",
      material: "Brass",
      origin: "Lahore",
      createdAt: "2025-08-20",
    },
    {
      id: "4",
      name: "Handwoven Carpet",
      category: "Textiles",
      price: 12500,
      stock: 3,
      status: "Low Stock",
      statusColor: "bg-amber-100 text-amber-700",
      image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=300&h=300&fit=crop",
      sales: 15,
      description: "Premium handwoven carpet with intricate patterns",
      material: "Wool",
      origin: "Peshawar",
      createdAt: "2025-07-05",
    },
    {
      id: "5",
      name: "Traditional Jewelry Set",
      category: "Jewelry",
      price: 5500,
      stock: 20,
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop",
      sales: 38,
      description: "Elegant traditional jewelry with authentic craftsmanship",
      material: "Gold Plated",
      origin: "Karachi",
      createdAt: "2025-08-01",
    },
  ]);

  const [orders, setOrders] = useState<SellerOrder[]>([
    {
      id: "ORD-2025-048",
      customer: "Ahmed Khan",
      customerEmail: "ahmed@example.com",
      productName: "Hand-Embroidered Shawl",
      productId: "1",
      quantity: 2,
      total: "PKR 7,000",
      totalAmount: 7000,
      date: "Oct 24, 2025",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-700",
      shippingAddress: "123 Main St, Karachi",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "ORD-2025-047",
      customer: "Fatima Ali",
      customerEmail: "fatima@example.com",
      productName: "Blue Pottery Vase Set",
      productId: "2",
      quantity: 1,
      total: "PKR 2,800",
      totalAmount: 2800,
      date: "Oct 23, 2025",
      status: "Processing",
      statusColor: "bg-blue-100 text-blue-700",
      shippingAddress: "456 Oak Ave, Lahore",
      paymentMethod: "Credit Card",
    },
    {
      id: "ORD-2025-046",
      customer: "Hassan Raza",
      customerEmail: "hassan@example.com",
      productName: "Brass Candle Holders",
      productId: "3",
      quantity: 3,
      total: "PKR 5,700",
      totalAmount: 5700,
      date: "Oct 22, 2025",
      status: "Ready to Ship",
      statusColor: "bg-purple-100 text-purple-700",
      shippingAddress: "789 Pine Rd, Islamabad",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "ORD-2025-045",
      customer: "Sara Malik",
      customerEmail: "sara@example.com",
      productName: "Handwoven Carpet",
      productId: "4",
      quantity: 1,
      total: "PKR 12,500",
      totalAmount: 12500,
      date: "Oct 21, 2025",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-700",
      shippingAddress: "321 Elm St, Multan",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "ORD-2025-044",
      customer: "Ali Haider",
      customerEmail: "ali@example.com",
      productName: "Traditional Jewelry Set",
      productId: "5",
      quantity: 1,
      total: "PKR 5,500",
      totalAmount: 5500,
      date: "Oct 20, 2025",
      status: "Processing",
      statusColor: "bg-blue-100 text-blue-700",
      shippingAddress: "654 Maple Dr, Faisalabad",
      paymentMethod: "Credit Card",
    },
    {
      id: "ORD-2025-043",
      customer: "Zainab Ahmed",
      customerEmail: "zainab@example.com",
      productName: "Hand-Embroidered Shawl",
      productId: "1",
      quantity: 1,
      total: "PKR 3,500",
      totalAmount: 3500,
      date: "Oct 18, 2025",
      status: "Delivered",
      statusColor: "bg-emerald-100 text-emerald-700",
      shippingAddress: "987 Cedar Ln, Peshawar",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "ORD-2025-042",
      customer: "Imran Shah",
      customerEmail: "imran@example.com",
      productName: "Blue Pottery Vase Set",
      productId: "2",
      quantity: 2,
      total: "PKR 5,600",
      totalAmount: 5600,
      date: "Oct 17, 2025",
      status: "Shipped",
      statusColor: "bg-cyan-100 text-cyan-700",
      shippingAddress: "147 Birch St, Sialkot",
      paymentMethod: "Credit Card",
    },
  ]);

  const [conversations, setConversations] = useState<SellerConversation[]>([
    {
      id: 0,
      customer: "Ahmed Khan",
      lastMessage: "Is this shawl available in blue color?",
      time: "2 min ago",
      unread: 2,
      productImage: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=50&h=50&fit=crop",
      messages: [
        { sender: "customer", text: "Hi! I'm interested in your hand-embroidered shawl.", time: "10:30 AM" },
        { sender: "seller", text: "Hello! Thank you for your interest. Which design are you looking at?", time: "10:32 AM" },
        { sender: "customer", text: "The red one with golden embroidery. Is this shawl available in blue color?", time: "10:35 AM" },
      ],
    },
    {
      id: 1,
      customer: "Fatima Ali",
      lastMessage: "When will my order be shipped?",
      time: "1 hour ago",
      unread: 1,
      productImage: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=50&h=50&fit=crop",
      messages: [
        { sender: "customer", text: "I placed an order yesterday. Order #ORD-2025-047", time: "9:00 AM" },
        { sender: "seller", text: "Yes, I can see your order. It will be shipped within 24 hours.", time: "9:15 AM" },
        { sender: "customer", text: "When will my order be shipped?", time: "10:00 AM" },
      ],
    },
    {
      id: 2,
      customer: "Hassan Raza",
      lastMessage: "Thank you for the beautiful candle holders!",
      time: "3 hours ago",
      unread: 0,
      productImage: "https://images.unsplash.com/photo-1602874801006-94d67b8d6e2c?w=50&h=50&fit=crop",
      messages: [
        { sender: "customer", text: "Order received! The candle holders are beautiful!", time: "Yesterday" },
        { sender: "seller", text: "I'm so glad you love them! Thank you for your purchase.", time: "Yesterday" },
        { sender: "customer", text: "Thank you for the beautiful candle holders!", time: "Yesterday" },
      ],
    },
    {
      id: 3,
      customer: "Sara Malik",
      lastMessage: "Can you provide custom sizes for carpets?",
      time: "1 day ago",
      unread: 0,
      productImage: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=50&h=50&fit=crop",
      messages: [
        { sender: "customer", text: "Can you provide custom sizes for carpets?", time: "2 days ago" },
      ],
    },
  ]);

  const [notifications, setNotifications] = useState<SellerNotification[]>([
    {
      id: "notif-1",
      type: "order",
      title: "New Order Received",
      message: "You have a new order #ORD-2025-048 for Hand-Embroidered Shawl",
      time: "5 min ago",
      read: false,
    },
    {
      id: "notif-2",
      type: "message",
      title: "New Message",
      message: "Ahmed Khan sent you a message about Hand-Embroidered Shawl",
      time: "10 min ago",
      read: false,
    },
    {
      id: "notif-3",
      type: "order",
      title: "Order Ready to Ship",
      message: "Order #ORD-2025-046 is ready to be shipped",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "notif-4",
      type: "review",
      title: "New Review",
      message: "Hassan Raza left a 5-star review on Brass Candle Holders",
      time: "1 day ago",
      read: true,
    },
    {
      id: "notif-5",
      type: "system",
      title: "Low Stock Alert",
      message: "Brass Candle Holders is out of stock. Please update inventory.",
      time: "2 days ago",
      read: true,
    },
  ]);

  // Load products from backend or use mock data
  const loadProducts = async () => {
    if (MOCK_MODE) {
      // In mock mode, products are already set from initial state
      return;
    }

    try {
      // In backend mode, fetch seller's listings
      const response = await productService.getFixedPriceListings({ 
        ordering: '-created_at', // Newest first
        page_size: 50 
      });
      
      // Convert backend data to SellerProduct format
      const sellerProducts: SellerProduct[] = response.results.map(listing => ({
        id: listing.id.toString(),
        name: listing.product.name,
        category: listing.product.category_name,
        price: parseFloat(listing.price),
        stock: listing.quantity,
        sales: 0, // TODO: Get actual sales data
        status: listing.quantity > 10 ? "Active" : listing.quantity > 0 ? "Low Stock" : "Out of Stock",
        statusColor: listing.quantity > 10 
          ? "bg-emerald-100 text-emerald-700"
          : listing.quantity > 0 
          ? "bg-amber-100 text-amber-700" 
          : "bg-red-100 text-red-700",
        createdAt: new Date(listing.created_at).toISOString().split("T")[0],
        description: listing.product.description,
        image: listing.product.images[0]?.image_url || '',
        material: '', // TODO: Add material field to backend
        origin: listing.product.region?.name || '',
      }));

      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    }
  };

  // Load products on component mount in backend mode
  useEffect(() => {
    if (!MOCK_MODE) {
      loadProducts();
    }
  }, []);

  const addProduct = async (productData: Omit<SellerProduct, "id" | "sales" | "createdAt" | "status" | "statusColor">) => {
    if (MOCK_MODE) {
      // Mock mode implementation
      const newId = String(products.length + 1);
      const status = productData.stock > 10 ? "Active" : productData.stock > 0 ? "Low Stock" : "Out of Stock";
      const statusColor =
        status === "Active"
          ? "bg-emerald-100 text-emerald-700"
          : status === "Low Stock"
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700";

      const newProduct: SellerProduct = {
        ...productData,
        id: newId,
        sales: 0,
        status,
        statusColor,
        createdAt: new Date().toISOString().split("T")[0],
      };

      // Add to beginning of array to show newest first
      setProducts([newProduct, ...products]);
      toast.success('Product added successfully!');
      return;
    }

    // Backend mode implementation
    try {
      // Map SellerProduct data to backend Product format
      const backendProductData = {
        name: productData.name,
        description: productData.description || `${productData.name} - High quality product`,
        category: getCategoryIdByName(productData.category),
        condition: 'new' as const,
        // Note: images would be handled separately
      };

      const createdProduct = await productService.createProduct(backendProductData);
      
      // Create a fixed-price listing for this product
      const listingData = {
        product_id: createdProduct.id,
        price: productData.price,
        quantity: productData.stock,
      };

      await productService.createFixedPriceListing(listingData);
      
      toast.success('Product created successfully!');
      
      // Refresh the products list
      await loadProducts();
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const updateProduct = (id: string, updates: Partial<SellerProduct>) => {
    setProducts(products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, ...updates };
        
        // Auto-update status based on stock
        if (updates.stock !== undefined) {
          if (updates.stock > 10) {
            updatedProduct.status = "Active";
            updatedProduct.statusColor = "bg-emerald-100 text-emerald-700";
          } else if (updates.stock > 0) {
            updatedProduct.status = "Low Stock";
            updatedProduct.statusColor = "bg-amber-100 text-amber-700";
          } else {
            updatedProduct.status = "Out of Stock";
            updatedProduct.statusColor = "bg-red-100 text-red-700";
          }
        }
        
        return updatedProduct;
      }
      return product;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: SellerOrder["status"]) => {
    const statusColorMap: Record<SellerOrder["status"], string> = {
      Pending: "bg-amber-100 text-amber-700",
      Processing: "bg-blue-100 text-blue-700",
      "Ready to Ship": "bg-purple-100 text-purple-700",
      Shipped: "bg-cyan-100 text-cyan-700",
      Delivered: "bg-emerald-100 text-emerald-700",
      Cancelled: "bg-red-100 text-red-700",
    };

    setOrders(orders.map((order) =>
      order.id === orderId
        ? { ...order, status, statusColor: statusColorMap[status] }
        : order
    ));
  };

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

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <SellerContext.Provider
      value={{
        products,
        orders,
        conversations,
        notifications,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        sendMessage,
        markConversationAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getProductById,
        getOrderById,
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
