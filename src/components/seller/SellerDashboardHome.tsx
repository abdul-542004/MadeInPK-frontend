import { useState, useEffect } from "react";
import { Package, ShoppingBag, DollarSign, TrendingUp, Eye, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { useAuth } from "../../contexts/AuthContext";
import { useSeller } from "../../contexts/SellerContext";
import { ScrollArea } from "../ui/scroll-area";
import { SellerOrder, OrderStatus } from "../../types/seller";

interface SellerDashboardHomeProps {
  onAddProduct: () => void;
}

// Helper function to get status color
const getStatusColor = (status: OrderStatus): string => {
  const statusColors: Record<OrderStatus, string> = {
    pending_payment: "bg-amber-100 text-amber-700",
    payment_failed: "bg-red-100 text-red-700",
    paid: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-gray-100 text-gray-700",
  };
  return statusColors[status];
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function SellerDashboardHome({ onAddProduct }: SellerDashboardHomeProps) {
  const { user } = useAuth();
  const { products, orders, notifications, markNotificationAsRead, markAllNotificationsAsRead, statistics, loadStatistics } = useSeller();
  const [viewingOrder, setViewingOrder] = useState<SellerOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Load statistics from backend
  useEffect(() => {
    loadStatistics();
    setLoading(false);
  }, []);

  // Use backend statistics
  const totalOrders = statistics.total_orders;
  const pendingOrders = statistics.pending_orders;
  const earningsThisMonth = parseFloat(statistics.total_revenue);
  const productsListed = statistics.total_products;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+12%",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      change: `+${pendingOrders}`,
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Earnings This Month",
      value: `PKR ${earningsThisMonth.toLocaleString()}`,
      change: "+18%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Products Listed",
      value: productsListed.toString(),
      change: `+${productsListed - 20}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const recentOrders = orders
    .filter(o => !["delivered", "cancelled"].includes(o.status))
    .slice(0, 4);

  const recentProducts = products.slice(0, 4);
  
  const unreadNotifications = notifications.filter(n => !n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "📦";
      case "message":
        return "💬";
      case "review":
        return "⭐";
      case "system":
        return "🔔";
      default:
        return "📌";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Welcome back, {user?.first_name || user?.username}! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-2">
          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-gray-900">Notifications</h3>
                {unreadNotifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-emerald-700"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[400px]">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          !notif.read ? "bg-emerald-50" : ""
                        }`}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <span className="text-2xl">{getNotificationIcon(notif.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <p className="text-sm text-gray-900">{notif.title}</p>
                              {!notif.read && (
                                <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Button onClick={onAddProduct} className="bg-emerald-700 hover:bg-emerald-800">
            + Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-emerald-600">{stat.change}</span>
                </div>
                <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Summary Table */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{order.product_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(order.status)}>{order.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewingOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No recent orders
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Products Section */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Recent Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={product.images[0]?.image_url || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h4 className="text-sm text-gray-900 mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-sm text-emerald-700">PKR {product.price ? parseFloat(product.price).toLocaleString() : 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Stock: {product.quantity || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {viewingOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="text-gray-900">{viewingOrder.buyer_username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="text-gray-900">{viewingOrder.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-gray-900">{viewingOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-gray-900">PKR {parseFloat(viewingOrder.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your Earnings</p>
                  <p className="text-gray-900">PKR {parseFloat(viewingOrder.seller_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-gray-900">{formatDate(viewingOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(viewingOrder.status)}>{viewingOrder.status.replace('_', ' ')}</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                <p className="text-gray-900">
                  {viewingOrder.shipping_address_detail.street_address}, {viewingOrder.shipping_address_detail.city_name}, {viewingOrder.shipping_address_detail.province_name} {viewingOrder.shipping_address_detail.postal_code}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingOrder(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
