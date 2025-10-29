import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, Heart, User, LayoutDashboard, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { AuthDialog } from "./AuthDialog";
import { SearchDialog } from "./SearchDialog";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Product } from "../data/mockProducts";
import logo from "figma:asset/5b5a9ccaf2f6b76406aeb93df9f19f90423b3a15.png";

type Page = "home" | "products" | "wishlist" | "cart" | "checkout" | "order-success" | "about" | "heritage" | "admin-dashboard" | "auctions";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onCartClick: () => void;
  onProductSelect?: (product: Product) => void;
  onSearchSubmit?: (query: string) => void;
  onAccountClick?: () => void;
  onNotificationClick?: () => void;
}

export function Header({ 
  currentPage, 
  onNavigate, 
  onCartClick, 
  onProductSelect, 
  onSearchSubmit,
  onAccountClick,
  onNotificationClick
}: HeaderProps) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { wishlistItems } = useWishlist();
  const { getCartCount } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const cartCount = getCartCount();

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAuthButtonClick = () => {
    if (isAuthenticated) {
      onAccountClick?.();
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-emerald-700/70 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <img src={logo} alt="MadeInPK Logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                <h1 className="text-white">MadeInPK</h1>
                <span className="text-xs text-white/90 hidden sm:inline">
                  Authentic Pakistani Crafts
                </span>
              </div>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onNavigate("home")}
                className={`transition ${
                  currentPage === "home"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate("products")}
                className={`transition ${
                  currentPage === "products"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => onNavigate("auctions")}
                className={`transition ${
                  currentPage === "auctions"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Auctions
              </button>
              <button 
                onClick={() => onNavigate("heritage")}
                className={`transition ${
                  currentPage === "heritage"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Heritage
              </button>
              <button 
                onClick={() => onNavigate("about")}
                className={`transition ${
                  currentPage === "about"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                About
              </button>
              
              {/* Admin Dashboard - Only visible to admin users */}
              {isAdmin && (
                <button 
                  onClick={() => onNavigate("admin-dashboard")}
                  className={`flex items-center gap-2 transition ${
                    currentPage === "admin-dashboard"
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </button>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSearchDialogOpen(true)}
                      className="text-white hover:bg-white/10 hover:text-white"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Search (⌘K)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Notifications - Only show when logged in */}
              {isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onNotificationClick}
                  className="relative text-white hover:bg-white/10 hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-emerald-700 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onNavigate("wishlist")}
                className={`relative hidden sm:flex hover:bg-white/10 ${
                  currentPage === "wishlist" ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-emerald-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCartClick}
                className="relative text-white hover:bg-white/10 hover:text-white"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-emerald-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button 
                onClick={handleAuthButtonClick}
                className="bg-white hover:bg-white/90 text-emerald-700 hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                {isAuthenticated ? "Account" : "Login"}
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <SearchDialog 
        open={searchDialogOpen} 
        onOpenChange={setSearchDialogOpen}
        onProductSelect={onProductSelect}
        onNavigateToProducts={() => onNavigate("products")}
        onSearchSubmit={onSearchSubmit}
      />
    </>
  );
}