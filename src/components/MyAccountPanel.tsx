import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { User, MapPin, Heart, Package, LogOut, Mail, Phone, Store } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { SellerRegistrationForm, SellerData } from "./SellerRegistrationForm";

interface MyAccountPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (page: string) => void;
  onOpenAddressPanel?: () => void;
  onOpenSellerDashboard?: () => void;
}

type AccountView = "menu" | "profile" | "orders";

export function MyAccountPanel({ 
  open, 
  onOpenChange, 
  onNavigate,
  onOpenAddressPanel,
  onOpenSellerDashboard
}: MyAccountPanelProps) {
  const { user, logout, updateProfile, isSeller, becomeSeller } = useAuth();
  const [currentView, setCurrentView] = useState<AccountView>("menu");
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [showSellerRegistration, setShowSellerRegistration] = useState(false);

  // Mock orders data
  const orders = [
    {
      id: "ORD-2025-001",
      date: "Oct 15, 2025",
      items: 3,
      total: "PKR 15,500",
      status: "Delivered",
      statusColor: "text-emerald-700 bg-emerald-50"
    },
    {
      id: "ORD-2025-002",
      date: "Oct 18, 2025",
      items: 1,
      total: "PKR 4,200",
      status: "In Transit",
      statusColor: "text-blue-700 bg-blue-50"
    },
    {
      id: "ORD-2025-003",
      date: "Oct 20, 2025",
      items: 2,
      total: "PKR 8,900",
      status: "Processing",
      statusColor: "text-amber-700 bg-amber-50"
    }
  ];

  const handleSaveProfile = () => {
    updateProfile({ 
      first_name: firstName, 
      last_name: lastName, 
      email, 
      phone_number: phone 
    });
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    toast.success("Logged out successfully!");
  };

  const handleWishlistClick = () => {
    onOpenChange(false);
    onNavigate?.("wishlist");
  };

  const handleAddressClick = () => {
    onOpenChange(false);
    onOpenAddressPanel?.();
  };

  const handleBecomeSellerClick = () => {
    if (isSeller) {
      onOpenChange(false);
      onOpenSellerDashboard?.();
    } else {
      setShowSellerRegistration(true);
    }
  };

  const handleSellerRegistrationComplete = (sellerData: SellerData) => {
    becomeSeller(sellerData);
    toast.success("Congratulations! You are now a seller. Opening your dashboard...");
    setTimeout(() => {
      onOpenChange(false);
      onOpenSellerDashboard?.();
    }, 1000);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return user.username;
  };

  const renderMenu = () => (
    <div className="flex flex-col h-full">
      {/* User Profile Header */}
      <div className="flex flex-col items-center py-8 border-b flex-shrink-0">
        <Avatar className="h-20 w-20 mb-4 bg-emerald-700">
          <AvatarFallback className="text-white text-2xl">
            {user ? getInitials(user.first_name, user.last_name) : "U"}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-gray-900 mb-1">{getUserDisplayName()}</h3>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4 overflow-y-auto">
        <button
          onClick={() => setCurrentView("profile")}
          className="w-full flex items-center gap-3 px-6 py-3 hover:bg-emerald-50 transition-colors text-left"
        >
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">My Profile</span>
        </button>

        <button
          onClick={handleAddressClick}
          className="w-full flex items-center gap-3 px-6 py-3 hover:bg-emerald-50 transition-colors text-left"
        >
          <MapPin className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">Address</span>
        </button>

        <button
          onClick={handleWishlistClick}
          className="w-full flex items-center gap-3 px-6 py-3 hover:bg-emerald-50 transition-colors text-left"
        >
          <Heart className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">My List</span>
        </button>

        <button
          onClick={() => setCurrentView("orders")}
          className="w-full flex items-center gap-3 px-6 py-3 hover:bg-emerald-50 transition-colors text-left"
        >
          <Package className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">My Orders</span>
        </button>

        <Separator className="my-2" />

        <button
          onClick={handleBecomeSellerClick}
          className="w-full flex items-center gap-3 px-6 py-3 hover:bg-emerald-50 transition-colors text-left"
        >
          <Store className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">{isSeller ? "Seller Dashboard" : "Become a Seller"}</span>
        </button>

        <Separator className="my-2" />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-3 hover:bg-red-50 transition-colors text-left text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b px-6">
        <button
          onClick={() => setCurrentView("menu")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h3 className="text-gray-900">My Profile</h3>
        <button
          onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
          className="text-emerald-700 hover:text-emerald-800 text-sm"
        >
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24 bg-emerald-700">
            <AvatarFallback className="text-white text-3xl">
              {user ? getInitials(user.first_name, user.last_name) : "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!editMode}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!editMode}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editMode}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+923001234567"
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!editMode}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleSaveProfile}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setEditMode(false);
                setFirstName(user?.first_name || "");
                setLastName(user?.last_name || "");
                setEmail(user?.email || "");
                setPhone(user?.phone_number || "");
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}

        {!editMode && (
          <div className="mt-8">
            <button className="text-emerald-700 hover:text-emerald-800 text-sm">
              Change Password →
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center py-4 border-b px-6">
        <button
          onClick={() => setCurrentView("menu")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h3 className="text-gray-900 ml-4">My Orders</h3>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {order.items} {order.items === 1 ? 'item' : 'items'}
                </p>
                <p className="text-gray-900">{order.total}</p>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet</p>
            <Button
              onClick={() => {
                onOpenChange(false);
                onNavigate?.("products");
              }}
              className="mt-4 bg-emerald-700 hover:bg-emerald-800"
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "profile":
        return renderProfile();
      case "orders":
        return renderOrders();
      default:
        return renderMenu();
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          <SheetTitle className="sr-only">
            {currentView === "profile" ? "My Profile" : currentView === "orders" ? "My Orders" : "My Account"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {currentView === "profile" 
              ? "View and edit your profile information" 
              : currentView === "orders" 
              ? "View your order history" 
              : "Access your account settings and information"}
          </SheetDescription>
          {renderContent()}
        </SheetContent>
      </Sheet>

      <SellerRegistrationForm
        open={showSellerRegistration}
        onOpenChange={setShowSellerRegistration}
        onComplete={handleSellerRegistrationComplete}
      />
    </>
  );
}