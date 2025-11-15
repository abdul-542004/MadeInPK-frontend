import { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { sellerService } from "../../services/sellerService";
import { MOCK_MODE } from "../../lib/mockMode";
import { toast } from "sonner";

interface BackendOrder {
  id: number;
  order_number: string;
  buyer_username: string;
  product_name: string | null;
  order_type: 'auction' | 'fixed_price' | 'cart';
  quantity: number | null;
  total_amount: string;
  seller_amount: string | null;
  status: 'pending_payment' | 'payment_failed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  items?: Array<{
    product_name: string;
    quantity: number;
    unit_price: string;
    subtotal: string;
  }>;
}

export function SellerOrderHistory() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (MOCK_MODE) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await sellerService.getSellerOrders();
      setOrders(response.results || []);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error(error.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: BackendOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: BackendOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return 'PKR 0';
    return `PKR ${parseFloat(amount).toLocaleString()}`;
  };

  // Filter for completed orders (Delivered, Cancelled, Shipped)
  const completedOrders = orders.filter((o) =>
    ["delivered", "cancelled", "shipped"].includes(o.status)
  );

  const filteredOrders = completedOrders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.buyer_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.product_name && order.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalRevenue = completedOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, order) => sum + parseFloat(order.seller_amount || '0'), 0);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Order History</h1>
        <p className="text-gray-600">View your completed and past orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <h3 className="text-gray-900">{completedOrders.length}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <h3 className="text-gray-900">
                  {completedOrders.filter((o) => o.status === "delivered").length}
                </h3>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <h3 className="text-gray-900">PKR {totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search order history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Order History Table */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Completed Orders</CardTitle>
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
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Completed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{order.buyer_username}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {order.product_name || (order.items && order.items.length > 0 ? `${order.items.length} items` : 'N/A')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{order.quantity || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatAmount(order.total_amount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {order.status === 'delivered' ? formatDate(order.delivered_at) : 
                         order.status === 'shipped' ? formatDate(order.shipped_at) : 
                         formatDate(order.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No order history found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}