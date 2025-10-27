import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { AddressProvider } from "./contexts/AddressContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SellerProvider } from "./contexts/SellerContext";
import { AuctionProvider } from "./contexts/AuctionContext";
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
import { listingApi, FixedPriceListing } from "./services/api";
import { Product } from "./data/mockProducts";

function AuctionDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <AuctionDetailPage 
      auctionId={id || ''}
      onBack={() => navigate('/auctions')}
    />
  );
}

function ProductDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        // For now, we'll need to find the product from listings
        // In a real app, you'd have a dedicated product API endpoint
        const response = await listingApi.getListings({ status: 'active' });
        if (response.data) {
          const listing = response.data.results.find(l => l.product.id.toString() === id);
          if (listing) {
            const productData: Product = {
              id: listing.product.id,
              name: listing.product.name,
              price: parseFloat(listing.price),
              originalPrice: undefined,
              rating: listing.product.average_rating || 0,
              reviews: listing.product.total_reviews || 0,
              image: listing.product.images.find(img => img.is_primary)?.image_url || listing.product.images[0]?.image_url || '',
              category: listing.product.category_name,
              region: 'Pakistan',
              description: listing.product.description,
              inStock: listing.quantity > 0,
              featured: listing.featured || false,
              seller: listing.product.seller_username,
              condition: listing.product.condition,
              images: listing.product.images.map(img => img.image_url)
            };
            setProduct(productData);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-16">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/products')} className="text-emerald-700 hover:text-emerald-800">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <ProductDetailPage 
      product={product}
      onBack={() => navigate('/products')}
      onProductClick={(p) => navigate(`/products/${p.id}`)}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartPanelOpen, setIsCartPanelOpen] = useState(false);
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState(false);
  const [isAddressPanelOpen, setIsAddressPanelOpen] = useState(false);

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/auctions')) return 'auctions';
    if (path.startsWith('/wishlist')) return 'wishlist';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/checkout')) return 'checkout';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/heritage')) return 'heritage';
    if (path.startsWith('/admin')) return 'admin-dashboard';
    if (path.startsWith('/seller')) return 'seller-dashboard';
    return 'home';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={getCurrentPage()}
        onNavigate={(page) => navigate(`/${page === 'home' ? '' : page}`)}
        onCartClick={() => setIsCartPanelOpen(true)}
        onProductSelect={() => {}}
        onSearchSubmit={(query) => navigate(`/products?search=${query}`)}
        onAccountClick={() => setIsAccountPanelOpen(true)}
      />
      
      <Routes>
        <Route path="/" element={
          <HomePage 
            onNavigate={(page) => navigate(`/${page}`)}
            onAuctionClick={(auctionId) => navigate(`/auctions/${auctionId}`)}
            onViewAllAuctions={() => navigate('/auctions')}
          />
        } />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPageWrapper />} />
        <Route path="/auctions" element={
          <AuctionPage onAuctionClick={(auctionId) => navigate(`/auctions/${auctionId}`)} />
        } />
        <Route path="/auctions/:id" element={<AuctionDetailPageWrapper />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={
          <CartPage
            onContinueShopping={() => navigate('/products')}
            onCheckout={() => navigate('/checkout')}
          />
        } />
        <Route path="/checkout" element={
          <CheckoutPage
            onBackToCart={() => navigate('/cart')}
            onOrderSuccess={() => navigate('/order-success')}
          />
        } />
        <Route path="/order-success" element={
          <OrderSuccessPage
            onBackToHome={() => navigate('/')}
            email="customer@example.com"
          />
        } />
        <Route path="/about" element={<AboutUsPage onNavigate={(page) => navigate(`/${page}`)} />} />
        <Route path="/heritage" element={<HeritagePage onNavigate={(page) => navigate(`/${page}`)} />} />
        <Route path="/admin" element={<AdminDashboard onNavigate={(page) => navigate(`/${page}`)} />} />
        <Route path="/seller" element={<SellerDashboard onNavigate={(page) => navigate(`/${page}`)} />} />
      </Routes>
      
      <Footer />
    
      <CartPanel
        open={isCartPanelOpen}
        onOpenChange={setIsCartPanelOpen}
        onViewCart={() => navigate('/cart')}
        onCheckout={() => {
          setIsCartPanelOpen(false);
          navigate('/checkout');
        }}
      />
      
      <MyAccountPanel
        open={isAccountPanelOpen}
        onOpenChange={setIsAccountPanelOpen}
        onNavigate={(page) => navigate(`/${page}`)}
        onOpenAddressPanel={() => setIsAddressPanelOpen(true)}
        onOpenSellerDashboard={() => navigate('/seller')}
      />
      
      <AddressPanel
        open={isAddressPanelOpen}
        onOpenChange={setIsAddressPanelOpen}
      />
      
      <Toaster position="top-right" richColors duration={2000} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <WishlistProvider>
        <CartProvider>
          <AddressProvider>
            <AuthProvider>
              <SellerProvider>
                <AuctionProvider>
                  <AppContent />
                </AuctionProvider>
              </SellerProvider>
            </AuthProvider>
          </AddressProvider>
        </CartProvider>
      </WishlistProvider>
    </Router>
  );
}