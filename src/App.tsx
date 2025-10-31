import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { AddressProvider } from "./contexts/AddressContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SellerProvider } from "./contexts/SellerContext";
import { AuctionProvider } from "./contexts/AuctionContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { NotificationConnector } from "./components/NotificationConnector";
import { ChatbotProvider } from "./contexts/ChatbotContext";
import { ChatBot } from "./components/ChatBot";
import { Product } from "./data/mockProducts";
import { Toaster } from "./components/ui/sonner";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { WishlistPage } from "./components/WishlistPage";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderSuccessPage } from "./components/OrderSuccessPage";
import { AboutUsPage } from "./components/AboutUsPage";
import { HeritagePage } from "./components/HeritagePage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { SellerDashboard } from "./components/seller/SellerDashboard";
import AuctionPage from "./components/AuctionPage";
import AuctionDetailPage from "./components/AuctionDetailPage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartPanel } from "./components/CartPanel";
import { MyAccountPanel } from "./components/MyAccountPanel";
import { AddressPanel } from "./components/AddressPanel";
import { NotificationPanel } from "./components/NotificationPanel";

// Main App wrapper with Router
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string>("");
  const [isCartPanelOpen, setIsCartPanelOpen] = useState(false);
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState(false);
  const [isAddressPanelOpen, setIsAddressPanelOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getCurrentPage = (): string => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/products")) return "products";
    if (path.startsWith("/product/")) return "product-detail";
    if (path === "/wishlist") return "wishlist";
    if (path === "/cart") return "cart";
    if (path === "/checkout") return "checkout";
    if (path === "/order-success") return "order-success";
    if (path === "/about") return "about";
    if (path === "/heritage") return "heritage";
    if (path === "/admin-dashboard") return "admin-dashboard";
    if (path === "/seller-dashboard") return "seller-dashboard";
    if (path === "/auctions") return "auctions";
    if (path.startsWith("/auction/")) return "auction-detail";
    return "home";
  };

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: "/",
      products: "/products",
      wishlist: "/wishlist",
      cart: "/cart",
      checkout: "/checkout",
      "order-success": "/order-success",
      about: "/about",
      heritage: "/heritage",
      "admin-dashboard": "/admin-dashboard",
      "seller-dashboard": "/seller-dashboard",
      auctions: "/auctions",
    };
    
    if (routes[page]) {
      navigate(routes[page]);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    navigate("/products");
  };

  const handleAuctionSelect = (auctionId: string) => {
    setSelectedAuctionId(auctionId);
    navigate(`/auction/${auctionId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={getCurrentPage() as any}
        onNavigate={handleNavigate as any}
        onCartClick={() => setIsCartPanelOpen(true)}
        onProductSelect={handleProductSelect}
        onSearchSubmit={handleSearchSubmit}
        onAccountClick={() => setIsAccountPanelOpen(true)}
        onNotificationClick={() => setIsNotificationPanelOpen(true)}
      />

      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route 
          path="/products" 
          element={
            <ProductsPage 
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProductDetailPage 
              product={selectedProduct!}
              onBack={() => navigate("/products")}
              onProductClick={handleProductSelect}
              onNavigate={handleNavigate}
            />
          } 
        />
        <Route 
          path="/wishlist" 
          element={
            <WishlistPage
              onProductClick={setSelectedProduct}
              onContinueShopping={() => navigate("/products")}
            />
          } 
        />
        <Route 
          path="/cart" 
          element={
            <CartPage
              onContinueShopping={() => navigate("/products")}
              onCheckout={() => navigate("/checkout")}
            />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <CheckoutPage 
              onOrderSuccess={() => navigate("/order-success")}
              onBackToCart={() => navigate("/cart")}
            />
          } 
        />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/heritage" element={<HeritagePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard onNavigate={handleNavigate} />} />
        <Route 
          path="/seller-dashboard" 
          element={<SellerDashboard onNavigate={handleNavigate} />} 
        />
        <Route 
          path="/auctions" 
          element={
            <AuctionPage onAuctionClick={handleAuctionSelect} />
          } 
        />
        <Route 
          path="/auction/:id" 
          element={
            <AuctionDetailPage 
              auctionId=""
              onBack={() => navigate("/auctions")}
            />
          } 
        />
        {/* Catch-all route for preview_page.html and other unmatched routes */}
        <Route path="/preview_page.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer onNavigate={handleNavigate} />

      {/* Panels */}
      <CartPanel
        open={isCartPanelOpen}
        onOpenChange={setIsCartPanelOpen}
        onViewCart={() => navigate("/cart")}
        onCheckout={() => {
          setIsCartPanelOpen(false);
          navigate("/checkout");
        }}
      />

      <MyAccountPanel
        open={isAccountPanelOpen}
        onOpenChange={setIsAccountPanelOpen}
        onNavigate={handleNavigate}
        onOpenAddressPanel={() => setIsAddressPanelOpen(true)}
        onOpenSellerDashboard={() => navigate("/seller-dashboard")}
      />

      <AddressPanel
        open={isAddressPanelOpen}
        onOpenChange={setIsAddressPanelOpen}
      />

      <NotificationPanel
        open={isNotificationPanelOpen}
        onOpenChange={setIsNotificationPanelOpen}
      />

      {/* ChatBot */}
      <ChatBot />

      <Toaster position="top-right" richColors duration={2000} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AddressProvider>
              <NotificationProvider>
                <ChatbotProvider>
                  <NotificationConnector>
                    <SellerProvider>
                      <AuctionProvider>
                        <AppContent />
                      </AuctionProvider>
                    </SellerProvider>
                  </NotificationConnector>
                </ChatbotProvider>
              </NotificationProvider>
            </AddressProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
