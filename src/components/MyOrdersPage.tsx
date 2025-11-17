import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, Eye, Download, MessageSquare, Star, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { orderService, Order } from "../services/orderService";
import { MOCK_MODE } from "../lib/mockMode";
import { toast } from "sonner";
import { ComplaintDialog } from "./ComplaintDialog";
import { FeedbackDialog } from "./FeedbackDialog";
import { BuyerMessageBox } from "./BuyerMessageBox";

interface MyOrdersPageProps {
  onBack: () => void;
}

const statusConfig = {
  pending_payment: {
    label: "Pending Payment",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  payment_failed: {
    label: "Payment Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
  paid: {
    label: "Paid",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: XCircle,
  },
};

export function MyOrdersPage({ onBack }: MyOrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Complaint & Feedback Dialog state
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [dialogOrder, setDialogOrder] = useState<Order | null>(null);
  
  // Message box state
  const [messageBoxOpen, setMessageBoxOpen] = useState(false);
  const [messageBoxSellerId, setMessageBoxSellerId] = useState<number | null>(null);
  const [messageBoxSellerName, setMessageBoxSellerName] = useState<string>("");
  const [messageBoxProductId, setMessageBoxProductId] = useState<number | null>(null);
  const [messageBoxProductName, setMessageBoxProductName] = useState<string>("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      if (MOCK_MODE) {
        // Mock orders data
        const mockOrders: Order[] = [
          {
            id: 1,
            order_number: "ORD-2024-001",
            buyer: 1,
            buyer_username: "current_user",
            seller: 2,
            seller_username: "artisan_karachi",
            product: 10,
            product_name: "Handwoven Sindhi Ajrak",
            order_type: "fixed_price",
            quantity: 2,
            unit_price: "2500.00",
            total_amount: "5100.00",
            platform_fee: "100.00",
            seller_amount: "5000.00",
            shipping_address: 1,
            shipping_address_detail: {
              id: 1,
              street_address: "123 Main Street",
              city_name: "Karachi",
              province_name: "Sindh",
              postal_code: "75500",
            },
            status: "delivered",
            payment_url: "",
            payment_deadline: null,
            items: [],
            is_multi_seller: false,
            stripe_payment_intent_id: "pi_test_123",
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            paid_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
            shipped_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            delivered_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            order_number: "ORD-2024-002",
            buyer: 1,
            buyer_username: "current_user",
            seller: 3,
            seller_username: "artisan_lahore",
            product: 15,
            product_name: "Traditional Phulkari Dupatta",
            order_type: "fixed_price",
            quantity: 1,
            unit_price: "3500.00",
            total_amount: "3570.00",
            platform_fee: "70.00",
            seller_amount: "3500.00",
            shipping_address: 1,
            shipping_address_detail: {
              id: 1,
              street_address: "123 Main Street",
              city_name: "Karachi",
              province_name: "Sindh",
              postal_code: "75500",
            },
            status: "shipped",
            payment_url: "",
            payment_deadline: null,
            items: [],
            is_multi_seller: false,
            stripe_payment_intent_id: "pi_test_456",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            paid_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            shipped_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            delivered_at: null,
          },
          {
            id: 3,
            order_number: "ORD-2024-003",
            buyer: 1,
            buyer_username: "current_user",
            seller: null,
            seller_username: null,
            product: null,
            product_name: null,
            order_type: "cart",
            quantity: null,
            unit_price: null,
            total_amount: "8500.00",
            platform_fee: "170.00",
            seller_amount: null,
            shipping_address: 1,
            shipping_address_detail: {
              id: 1,
              street_address: "123 Main Street",
              city_name: "Karachi",
              province_name: "Sindh",
              postal_code: "75500",
            },
            status: "paid",
            payment_url: "",
            payment_deadline: null,
            items: [
              {
                id: 1,
                product_name: "Blue Pottery Set",
                quantity: 1,
                unit_price: "4500.00",
                subtotal: "4500.00",
              },
              {
                id: 2,
                product_name: "Camel Skin Lamp",
                quantity: 2,
                unit_price: "2000.00",
                subtotal: "4000.00",
              },
            ],
            is_multi_seller: true,
            stripe_payment_intent_id: "pi_test_789",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            paid_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            shipped_at: null,
            delivered_at: null,
          },
          {
            id: 4,
            order_number: "ORD-2024-004",
            buyer: 1,
            buyer_username: "current_user",
            seller: 2,
            seller_username: "artisan_karachi",
            product: 20,
            product_name: "Handcrafted Camel Skin Lamp",
            order_type: "auction",
            quantity: 1,
            unit_price: "15000.00",
            total_amount: "15300.00",
            platform_fee: "300.00",
            seller_amount: "15000.00",
            shipping_address: 1,
            shipping_address_detail: {
              id: 1,
              street_address: "123 Main Street",
              city_name: "Karachi",
              province_name: "Sindh",
              postal_code: "75500",
            },
            status: "pending_payment",
            payment_url: "https://checkout.stripe.com/test",
            payment_deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            items: [],
            is_multi_seller: false,
            stripe_payment_intent_id: "pi_test_101",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            paid_at: null,
            shipped_at: null,
            delivered_at: null,
          },
        ];
        setOrders(mockOrders);
      } else {
        const data = await orderService.getBuyerOrders({ ordering: "-created_at" });
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId: number) => {
    try {
      if (MOCK_MODE) {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: "delivered" as const, delivered_at: new Date().toISOString() }
            : order
        ));
        toast.success("Order marked as delivered!");
      } else {
        await orderService.markDelivered(orderId);
        toast.success("Order marked as delivered!");
        await loadOrders();
      }
    } catch (error) {
      console.error("Failed to mark order as delivered:", error);
      toast.error("Failed to mark order as delivered");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return ["pending_payment", "paid"].includes(order.status);
    if (activeTab === "shipped") return order.status === "shipped";
    if (activeTab === "delivered") return order.status === "delivered";
    return true;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getOrderItems = (order: Order) => {
    if (order.order_type === "cart" && order.items && order.items.length > 0) {
      return order.items;
    }
    if (order.product_name) {
      return [
        {
          id: order.id,
          product_name: order.product_name,
          quantity: order.quantity || 1,
          unit_price: order.unit_price || "0.00",
          subtotal: (parseFloat(order.unit_price || "0") * (order.quantity || 1)).toFixed(2),
        },
      ];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-700 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-emerald-700 mt-4">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your purchases</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto mb-6">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-none">
              Pending ({orders.filter(o => ["pending_payment", "paid"].includes(o.status)).length})
            </TabsTrigger>
            <TabsTrigger value="shipped" className="flex-1 sm:flex-none">
              Shipped ({orders.filter(o => o.status === "shipped").length})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex-1 sm:flex-none">
              Delivered ({orders.filter(o => o.status === "delivered").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 text-center">
                    {activeTab === "all"
                      ? "You haven't placed any orders yet"
                      : `No ${activeTab} orders`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const items = getOrderItems(order);

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-emerald-700">
                            Order #{order.order_number}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                        <Badge className={`${statusConfig[order.status].color} border w-fit`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {items.map((item, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.product_name}</p>
                                    <p className="text-sm text-gray-600">
                                      Quantity: {item.quantity} × PKR {parseFloat(item.unit_price).toLocaleString()}
                                    </p>
                                    {/* Show seller info for cart orders */}
                                    {order.order_type === "cart" && 'seller_username' in item && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500">
                                          Seller: {item.seller_username}
                                        </p>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                          onClick={() => {
                                            if ('seller_id' in item && 'product' in item) {
                                              setMessageBoxSellerId(item.seller_id);
                                              setMessageBoxSellerName(item.seller_username);
                                              setMessageBoxProductId(item.product);
                                              setMessageBoxProductName(item.product_name);
                                              setMessageBoxOpen(true);
                                            }
                                          }}
                                        >
                                          <MessageSquare className="h-3 w-3 mr-1" />
                                          Contact
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  <p className="font-semibold text-emerald-700 ml-4">
                                    PKR {parseFloat(item.subtotal).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                            <p className="text-sm text-gray-600">
                              {order.shipping_address_detail.street_address}
                              <br />
                              {order.shipping_address_detail.city_name},{" "}
                              {order.shipping_address_detail.province_name}
                              <br />
                              {order.shipping_address_detail.postal_code}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="text-gray-900">
                                  PKR {(parseFloat(order.total_amount) - parseFloat(order.platform_fee)).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Platform Fee:</span>
                                <span className="text-gray-900">
                                  PKR {parseFloat(order.platform_fee).toLocaleString()}
                                </span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-emerald-700">
                                  PKR {parseFloat(order.total_amount).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Order Timeline</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Order Placed:</span> {formatDateTime(order.created_at)}
                              </p>
                            </div>
                            {order.paid_at && (
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Payment Confirmed:</span> {formatDateTime(order.paid_at)}
                                </p>
                              </div>
                            )}
                            {order.shipped_at && (
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Shipped:</span> {formatDateTime(order.shipped_at)}
                                </p>
                              </div>
                            )}
                            {order.delivered_at && (
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Delivered:</span> {formatDateTime(order.delivered_at)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>

                          {order.status === "pending_payment" && order.payment_url && (
                            <Button
                              size="sm"
                              onClick={() => window.open(order.payment_url, "_blank")}
                              className="bg-emerald-700 hover:bg-emerald-800"
                            >
                              Complete Payment
                            </Button>
                          )}

                          {order.status === "shipped" && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkDelivered(order.id)}
                              className="bg-green-700 hover:bg-green-800"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Delivered
                            </Button>
                          )}

                          {/* Rate Seller - show only for auction orders that are shipped or delivered */}
                          {order.order_type === "auction" && (order.status === "shipped" || order.status === "delivered") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDialogOrder(order);
                                setFeedbackDialogOpen(true);
                              }}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Rate Seller
                            </Button>
                          )}

                          {/* Review Product - show only for cart and fixed_price orders that are shipped or delivered */}
                          {(order.order_type === "cart" || order.order_type === "fixed_price") && 
                           (order.status === "shipped" || order.status === "delivered") && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                              <Star className="h-4 w-4 text-amber-600" />
                              <p className="text-xs text-amber-700">
                                Don't forget to review this product!
                              </p>
                            </div>
                          )}

                          {/* Report Issue - show for shipped or delivered orders */}
                          {(order.status === "shipped" || order.status === "delivered") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDialogOrder(order);
                                setComplaintDialogOpen(true);
                              }}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Report Issue
                            </Button>
                          )}

                          {/* Contact Seller - show for all orders except cancelled and payment_failed */}
                          {!["cancelled", "payment_failed"].includes(order.status) && (
                            order.seller_username ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Open message box with seller info
                                  setMessageBoxSellerId(order.seller);
                                  setMessageBoxSellerName(order.seller_username || "Seller");
                                  setMessageBoxProductId(order.product);
                                  setMessageBoxProductName(order.product_name || "");
                                  setMessageBoxOpen(true);
                                }}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact {order.seller_username}
                              </Button>
                            ) : order.order_type === "cart" && order.items && order.items.length > 0 ? (
                              (() => {
                                // Get unique sellers from the cart items
                                const uniqueSellers = Array.from(
                                  new Map(
                                    order.items!.map(item => [
                                      item.seller_id,
                                      { id: item.seller_id, name: item.seller_username, product: item.product, productName: item.product_name }
                                    ])
                                  ).values()
                                );

                                if (uniqueSellers.length === 1) {
                                  // Single seller in cart
                                  const seller = uniqueSellers[0];
                                  return (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setMessageBoxSellerId(seller.id);
                                        setMessageBoxSellerName(seller.name);
                                        setMessageBoxProductId(seller.product);
                                        setMessageBoxProductName(seller.productName);
                                        setMessageBoxOpen(true);
                                      }}
                                    >
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Contact {seller.name}
                                    </Button>
                                  );
                                } else {
                                  // Multiple sellers - show info message
                                  return (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                      <MessageSquare className="h-4 w-4 text-blue-600" />
                                      <p className="text-xs text-blue-700">
                                        {uniqueSellers.length} sellers • Contact them from product pages
                                      </p>
                                    </div>
                                  );
                                }
                              })()
                            ) : null
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal (Simple Version) */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-emerald-700">
                  Order Details - #{selectedOrder.order_number}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Order Type</p>
                      <p className="font-medium capitalize">{selectedOrder.order_type.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <Badge className={`${statusConfig[selectedOrder.status].color} border w-fit mt-1`}>
                        {statusConfig[selectedOrder.status].label}
                      </Badge>
                    </div>
                    {selectedOrder.seller_username && (
                      <div>
                        <p className="text-gray-600">Seller</p>
                        <p className="font-medium">{selectedOrder.seller_username}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Payment Intent ID</p>
                      <p className="font-mono text-xs">{selectedOrder.stripe_payment_intent_id}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </Button>
                  {selectedOrder.status === "pending_payment" && selectedOrder.payment_url && (
                    <Button
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800"
                      onClick={() => {
                        window.open(selectedOrder.payment_url, "_blank");
                        setSelectedOrder(null);
                      }}
                    >
                      Complete Payment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Dialog */}
      {dialogOrder && (
        <ComplaintDialog
          open={complaintDialogOpen}
          onOpenChange={setComplaintDialogOpen}
          orderId={dialogOrder.id}
          sellerId={dialogOrder.seller || undefined}
          productName={dialogOrder.product_name || undefined}
        />
      )}

      {/* Feedback Dialog */}
      {dialogOrder && (
        <FeedbackDialog
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
          orderId={dialogOrder.id}
          orderNumber={dialogOrder.order_number}
          productName={dialogOrder.product_name || "Product"}
          sellerName={dialogOrder.seller_username || "Seller"}
        />
      )}

      {/* Buyer Message Box */}
      {messageBoxSellerId && (
        <BuyerMessageBox
          sellerId={messageBoxSellerId}
          sellerName={messageBoxSellerName}
          productName={messageBoxProductName}
          productId={messageBoxProductId || undefined}
          isOpen={messageBoxOpen}
          onToggle={() => setMessageBoxOpen(!messageBoxOpen)}
        />
      )}
    </div>
  );
}
