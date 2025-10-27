import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  History, 
  DollarSign, 
  MessageSquare, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Gavel
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SellerDashboardHome } from "./SellerDashboardHome";
import { SellerProducts } from "./SellerProducts";
import { SellerAddProduct } from "./SellerAddProduct";
import { SellerOrders } from "./SellerOrders";
import { SellerOrderHistory } from "./SellerOrderHistory";
import { SellerEarnings } from "./SellerEarnings";
import { SellerMessages } from "./SellerMessages";
import { SellerSettings } from "./SellerSettings";
import SellerAuctions from "./SellerAuctions";
import { toast } from "sonner@2.0.3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type SellerView = "dashboard" | "products" | "add-product" | "orders" | "order-history" | "earnings" | "messages" | "settings" | "auctions";

interface SellerDashboardProps {
  onNavigate: (page: string) => void;
}

export function SellerDashboard({ onNavigate }: SellerDashboardProps) {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<SellerView>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "dashboard" as SellerView, label: "Dashboard", icon: LayoutDashboard },
    { id: "products" as SellerView, label: "My Products", icon: Package },
    { id: "add-product" as SellerView, label: "Add New Product", icon: PlusCircle },
    { id: "auctions" as SellerView, label: "Auction Products", icon: Gavel },
    { id: "orders" as SellerView, label: "Orders", icon: ShoppingBag },
    { id: "order-history" as SellerView, label: "Order History", icon: History },
    { id: "earnings" as SellerView, label: "Earnings", icon: DollarSign },
    { id: "messages" as SellerView, label: "Messages", icon: MessageSquare },
    { id: "settings" as SellerView, label: "Settings", icon: Settings },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    onNavigate("home");
  };

  const handleBackToShopping = () => {
    onNavigate("home");
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <SellerDashboardHome onAddProduct={() => setCurrentView("add-product")} />;
      case "products":
        return <SellerProducts onAddProduct={() => setCurrentView("add-product")} />;
      case "add-product":
        return <SellerAddProduct onSuccess={() => setCurrentView("products")} />;
      case "auctions":
        return <SellerAuctions />;
      case "orders":
        return <SellerOrders />;
      case "order-history":
        return <SellerOrderHistory />;
      case "earnings":
        return <SellerEarnings />;
      case "messages":
        return <SellerMessages />;
      case "settings":
        return <SellerSettings />;
      default:
        return <SellerDashboardHome onAddProduct={() => setCurrentView("add-product")} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section - Logo and Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <button onClick={handleBackToShopping} className="flex items-center gap-2">
              <div className="bg-emerald-700 text-white px-3 py-1.5 rounded-md">
                <span className="text-lg">MadeInPK</span>
              </div>
              <span className="hidden sm:inline text-sm text-gray-600">Seller Dashboard</span>
            </button>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products, orders..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right Section - Notifications and Profile */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1">
                  <Avatar className="h-8 w-8 bg-emerald-700">
                    <AvatarFallback className="text-white text-sm">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm text-gray-700">{user?.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentView("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBackToShopping}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Back to Shopping
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 
            transform transition-transform duration-300 z-40
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col h-full py-4">
            <nav className="flex-1 px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${isActive 
                        ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-700" 
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="px-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}