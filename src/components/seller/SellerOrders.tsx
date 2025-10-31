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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSeller, SellerOrder } from "../../contexts/SellerContext";
import { toast } from "sonner";
import { sellerService } from "../../services/sellerService";
import { MOCK_MODE } from "../../lib/mockMode";

export function SellerOrders() {
  const { orders: contextOrders, updateOrderStatus } = useSeller();
  const [orders, setOrders] = useState<SellerOrder[]>(contextOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingOrder, setViewingOrder] = useState<SellerOrder | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<SellerOrder | null>(null);
  const [newStatus, setNewStatus] = useState<SellerOrder["status"]>("Pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (MOCK_MODE) {
      // Use mock data from context
      setOrders(contextOrders);
      setLoading(false);
      return;
    }

    // Backend mode
    try {
      setLoading(true);
      const response = await sellerService.getSellerOrders();
      // Map backend orders to SellerOrder format if needed
      setOrders(response.results || response);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
      // Fallback to context orders
      setOrders(contextOrders);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOrders = filteredOrders.filter((o) => 
    !["Delivered", "Cancelled"].includes(o.status)
  );
  const pendingOrders = activeOrders.filter((o) => o.status === "Pending");
  const processingOrders = activeOrders.filter((o) => o.status === "Processing");
  const readyToShipOrders = activeOrders.filter((o) => o.status === "Ready to Ship");

  const handleViewOrder = (order: SellerOrder) => {
    setViewingOrder(order);
  };

  const handleUpdateStatus = (order: SellerOrder) => {
    setUpdatingOrder(order);
    setNewStatus(order.status);
  };

  const handleSaveStatus = () => {
    if (updatingOrder) {
      updateOrderStatus(updatingOrder.id, newStatus);
      toast.success("Order status updated successfully!");
      setUpdatingOrder(null);
    }
  };

  const OrdersTable = ({ orders }: { orders: typeof filteredOrders }) => (
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
                <span className="text-sm text-gray-900">{order.id}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700">{order.customer}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-700">{order.productName}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700">{order.quantity}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{order.total}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-600">{order.date}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={`${order.statusColor}`}>{order.status}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="View Details"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="Update Status"
                    onClick={() => handleUpdateStatus(order)}
                  >
                    <Truck className="h-4 w-4" />
                  </Button>
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
                <p className="text-sm text-gray-600 mb-1">Pending</p>
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
                <p className="text-sm text-gray-600 mb-1">Processing</p>
                <h3 className="text-gray-900">{processingOrders.length}</h3>
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
                <p className="text-sm text-gray-600 mb-1">Ready to Ship</p>
                <h3 className="text-gray-900">{readyToShipOrders.length}</h3>
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
                <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                <TabsTrigger value="processing">Processing ({processingOrders.length})</TabsTrigger>
                <TabsTrigger value="ready">Ready ({readyToShipOrders.length})</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <OrdersTable orders={activeOrders} />
            </TabsContent>
            <TabsContent value="pending">
              <OrdersTable orders={pendingOrders} />
            </TabsContent>
            <TabsContent value="processing">
              <OrdersTable orders={processingOrders} />
            </TabsContent>
            <TabsContent value="ready">
              <OrdersTable orders={readyToShipOrders} />
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
              {viewingOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="text-gray-900">{viewingOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Email</p>
                  <p className="text-gray-900">{viewingOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="text-gray-900">{viewingOrder.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-gray-900">{viewingOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-gray-900">{viewingOrder.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-gray-900">{viewingOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="text-gray-900">{viewingOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={viewingOrder.statusColor}>{viewingOrder.status}</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                <p className="text-gray-900">{viewingOrder.shippingAddress}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingOrder(null)}>Close</Button>
            {viewingOrder && (
              <Button 
                onClick={() => {
                  setViewingOrder(null);
                  handleUpdateStatus(viewingOrder);
                }}
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                Update Status
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!updatingOrder} onOpenChange={() => setUpdatingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {updatingOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-gray-600 mb-2 block">Select New Status</label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as SellerOrder["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Ready to Ship">Ready to Ship</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdatingOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} className="bg-emerald-700 hover:bg-emerald-800">
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
