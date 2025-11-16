import { useState, useEffect } from "react";
import { Search, Package, Eye, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
  shipping_address_detail: {
    street_address: string;
    city_name: string;
    province_name: string;
    postal_code: string;
  };
  status: 'pending_payment' | 'payment_failed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  items?: Array<{
    id: number;
    product_name: string;
    product_image: string | null;
    seller_id: number;
    seller_username: string;
    quantity: number;
    unit_price: string;
    subtotal: string;
    is_shipped: boolean;
    shipped_at: string | null;
  }>;
  is_multi_seller?: boolean;
  my_items_shipped?: boolean | null;
  all_items_shipped?: boolean | null;
}

export function SellerOrders() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingOrder, setViewingOrder] = useState<BackendOrder | null>(null);
  const [shippingOrderId, setShippingOrderId] = useState<number | null>(null);
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

  const handleMarkShipped = async () => {
    if (!shippingOrderId) return;

    try {
      await sellerService.markOrderShipped(shippingOrderId);
      toast.success("Order marked as shipped!");
      setShippingOrderId(null);
      loadOrders(); // Reload orders
    } catch (error: any) {
      console.error('Error marking order as shipped:', error);
      toast.error(error.response?.data?.error || 'Failed to mark order as shipped');
    }
  };

  const getStatusColor = (status: BackendOrder['status']) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-gray-100 text-gray-700';
      case 'payment_failed':
        return 'bg-red-100 text-red-700';
      case 'paid':
        return 'bg-amber-100 text-amber-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: BackendOrder['status']) => {
    switch (status) {
      case 'pending_payment':
        return 'Pending Payment';
      case 'payment_failed':
        return 'Payment Failed';
      case 'paid':
        return 'Paid';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
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

  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.buyer_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.product_name && order.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter for active orders (not delivered or cancelled)
  const activeOrders = filteredOrders.filter((o) => 
    !["delivered", "cancelled"].includes(o.status)
  );
  const paidOrders = activeOrders.filter((o) => o.status === "paid");
  const shippedOrders = activeOrders.filter((o) => o.status === "shipped");
  const pendingOrders = activeOrders.filter((o) => o.status === "pending_payment");

  const OrdersTable = ({ orders }: { orders: BackendOrder[] }) => (
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
          {orders.map((order) => (
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
                <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="View Details"
                    onClick={() => setViewingOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {/* Show mark as shipped button for single-seller paid orders or multi-seller orders where seller hasn't shipped */}
                  {order.status === 'paid' && (
                    order.is_multi_seller ? (
                      !order.my_items_shipped && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Mark My Items as Shipped"
                          onClick={() => setShippingOrderId(order.id)}
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      )
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Mark as Shipped"
                        onClick={() => setShippingOrderId(order.id)}
                      >
                        <Truck className="h-4 w-4" />
                      </Button>
                    )
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Active Orders</h1>
        <p className="text-gray-600">Manage your current orders and shipments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payment</p>
                <h3 className="text-gray-900">{pendingOrders.length}</h3>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid</p>
                <h3 className="text-gray-900">{paidOrders.length}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipped</p>
                <h3 className="text-gray-900">{shippedOrders.length}</h3>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-emerald-600" />
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
              placeholder="Search orders by ID, customer, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table with Tabs */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-gray-200 px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="all">All ({activeOrders.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending Payment ({pendingOrders.length})</TabsTrigger>
                <TabsTrigger value="paid">Paid ({paidOrders.length})</TabsTrigger>
                <TabsTrigger value="shipped">Shipped ({shippedOrders.length})</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <OrdersTable orders={activeOrders} />
            </TabsContent>
            <TabsContent value="pending">
              <OrdersTable orders={pendingOrders} />
            </TabsContent>
            <TabsContent value="paid">
              <OrdersTable orders={paidOrders} />
            </TabsContent>
            <TabsContent value="shipped">
              <OrdersTable orders={shippedOrders} />
            </TabsContent>
          </Tabs>
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
                  <p className="text-sm text-gray-600">Order Type</p>
                  <p className="text-gray-900">{viewingOrder.order_type.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="text-gray-900">{viewingOrder.product_name || `${viewingOrder.items?.length || 0} items`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-gray-900">{viewingOrder.quantity || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-gray-900">{formatAmount(viewingOrder.total_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your Earning</p>
                  <p className="text-gray-900">{formatAmount(viewingOrder.seller_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-gray-900">{formatDate(viewingOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(viewingOrder.status)}>{getStatusLabel(viewingOrder.status)}</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                <p className="text-gray-900">
                  {viewingOrder.shipping_address_detail.street_address}, {viewingOrder.shipping_address_detail.city_name}, {viewingOrder.shipping_address_detail.province_name} {viewingOrder.shipping_address_detail.postal_code}
                </p>
              </div>
              {viewingOrder.items && viewingOrder.items.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {viewingOrder.is_multi_seller ? 'Your Items' : 'Order Items'}
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-left">Quantity</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Subtotal</th>
                          {viewingOrder.is_multi_seller && (
                            <th className="px-4 py-2 text-left">Status</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {viewingOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2">{item.product_name}</td>
                            <td className="px-4 py-2">{item.quantity}</td>
                            <td className="px-4 py-2">{formatAmount(item.unit_price)}</td>
                            <td className="px-4 py-2">{formatAmount(item.subtotal)}</td>
                            {viewingOrder.is_multi_seller && (
                              <td className="px-4 py-2">
                                {item.is_shipped ? (
                                  <Badge className="bg-emerald-100 text-emerald-700">
                                    Shipped
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-700">
                                    Not Shipped
                                  </Badge>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {viewingOrder.is_multi_seller && (
                    <p className="text-xs text-gray-500 mt-2">
                      {viewingOrder.all_items_shipped 
                        ? '✓ All sellers have shipped their items' 
                        : viewingOrder.my_items_shipped
                        ? '✓ You have shipped your items. Waiting for other sellers.'
                        : '⚠ You need to ship your items'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingOrder(null)}>Close</Button>
            {viewingOrder && viewingOrder.status === 'paid' && (
              viewingOrder.is_multi_seller ? (
                !viewingOrder.my_items_shipped && (
                  <Button 
                    onClick={() => {
                      setViewingOrder(null);
                      setShippingOrderId(viewingOrder.id);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800"
                  >
                    Mark My Items as Shipped
                  </Button>
                )
              ) : (
                <Button 
                  onClick={() => {
                    setViewingOrder(null);
                    setShippingOrderId(viewingOrder.id);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  Mark as Shipped
                </Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Shipped Dialog */}
      <Dialog open={!!shippingOrderId} onOpenChange={() => setShippingOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Items as Shipped</DialogTitle>
            <DialogDescription>
              {orders.find(o => o.id === shippingOrderId)?.is_multi_seller
                ? 'Are you sure you want to mark your items in this order as shipped?'
                : 'Are you sure you want to mark this order as shipped?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingOrderId(null)}>
              Cancel
            </Button>
            <Button onClick={handleMarkShipped} className="bg-emerald-700 hover:bg-emerald-800">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
