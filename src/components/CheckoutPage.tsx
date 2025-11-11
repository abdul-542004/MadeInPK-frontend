import { useState } from "react";
import { MapPin, Plus, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "../contexts/CartContext";
import { useAddress } from "../contexts/AddressContext";
import { useAuth } from "../contexts/AuthContext";
import { AddressPanel } from "./AddressPanel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { orderService } from "../services/orderService";
import { MOCK_MODE } from "../lib/mockMode";

interface CheckoutPageProps {
  onBackToCart?: () => void;
  onOrderSuccess?: () => void;
}

export function CheckoutPage({ onBackToCart, onOrderSuccess }: CheckoutPageProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { addresses, getDefaultAddress } = useAddress();
  const { user } = useAuth();
  const [isAddressPanelOpen, setIsAddressPanelOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const defaultAddress = getDefaultAddress();

  const handleCheckout = async () => {
    if (!defaultAddress) {
      toast.error("Please add a delivery address");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    if (MOCK_MODE) {
      // Mock mode - just navigate to success page
      if (onOrderSuccess) {
        clearCart();
        onOrderSuccess();
      }
      return;
    }

    // Backend mode - create actual order
    setIsProcessing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          listing_id: item.listingId || item.product.id,
          quantity: item.quantity
        })),
        shipping_address: {
          full_name: defaultAddress.full_name,
          phone_number: defaultAddress.phone_number,
          address_line1: defaultAddress.address_line1,
          address_line2: defaultAddress.address_line2,
          city: defaultAddress.city.toString(),
          province: defaultAddress.province.toString(),
          postal_code: defaultAddress.postal_code
        },
        payment_method: selectedPaymentMethod
      };

      await orderService.createOrder(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      
      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Delivery Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl text-gray-900 mb-6">Select Delivery Address</h2>

              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-4">
                    <MapPin className="h-10 w-10 text-emerald-600" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    No Addresses found in your account!
                    <br />
                    <span className="text-sm">Add a delivery address.</span>
                  </p>
                  <Button
                    onClick={() => setIsAddressPanelOpen(true)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    ADD ADDRESS
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Display saved addresses */}
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border-2 rounded-lg ${
                        address.isDefault
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 uppercase">
                              {address.addressType}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-emerald-600 text-white rounded text-xs">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-900 mb-1">
                            {address.addressLine1}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.landmark && (
                            <p className="text-sm text-gray-600">
                              Landmark: {address.landmark}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="text-lg mr-1">🇵🇰</span>
                            {address.countryCode} {address.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Address Button */}
                  <button
                    onClick={() => setIsAddressPanelOpen(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-700"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add New Address</span>
                  </button>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl text-gray-900 mb-6">Payment Methods</h2>
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <button
                  onClick={() => setSelectedPaymentMethod("cod")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedPaymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white bg-gray-800 px-3 py-2 rounded">
                      CASH ON DELIVERY
                    </span>
                  </div>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setSelectedPaymentMethod("paypal")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedPaymentMethod === "paypal"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center h-12 bg-yellow-400 rounded">
                    <svg viewBox="0 0 100 32" className="h-6">
                      <path
                        fill="#003087"
                        d="M12 4.917v18.42c0 1.5-1.2 2.73-2.69 2.73H4.69A2.72 2.72 0 0 1 2 23.337V4.917C2 3.417 3.2 2.187 4.69 2.187h4.62C10.8 2.187 12 3.417 12 4.917zm2.5 0c0-1.5 1.2-2.73 2.69-2.73h4.62c1.49 0 2.69 1.23 2.69 2.73v18.42c0 1.5-1.2 2.73-2.69 2.73h-4.62a2.72 2.72 0 0 1-2.69-2.73V4.917z"
                      />
                      <text
                        x="28"
                        y="20"
                        fill="#003087"
                        fontFamily="Arial"
                        fontSize="16"
                        fontWeight="bold"
                      >
                        PayPal
                      </text>
                    </svg>
                  </div>
                </button>

                {/* Pay Later */}
                <button
                  onClick={() => setSelectedPaymentMethod("paylater")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedPaymentMethod === "paylater"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center h-12 bg-yellow-400 rounded">
                    <svg viewBox="0 0 100 32" className="h-6">
                      <path
                        fill="#003087"
                        d="M12 4.917v18.42c0 1.5-1.2 2.73-2.69 2.73H4.69A2.72 2.72 0 0 1 2 23.337V4.917C2 3.417 3.2 2.187 4.69 2.187h4.62C10.8 2.187 12 3.417 12 4.917zm2.5 0c0-1.5 1.2-2.73 2.69-2.73h4.62c1.49 0 2.69 1.23 2.69 2.73v18.42c0 1.5-1.2 2.73-2.69 2.73h-4.62a2.72 2.72 0 0 1-2.69-2.73V4.917z"
                      />
                      <text
                        x="28"
                        y="20"
                        fill="#003087"
                        fontFamily="Arial"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        Pay Later
                      </text>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">Your Order</h2>

              {/* Product List */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm pb-2 border-b">
                  <span className="text-gray-600">Product</span>
                  <span className="text-gray-600">Subtotal</span>
                </div>

                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">
                        ₨{item.product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="space-y-3 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₨{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-emerald-700">Free</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-red-500">₨{subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={!defaultAddress || !selectedPaymentMethod}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                CHECKOUT
              </Button>

              {onBackToCart && (
                <Button
                  onClick={onBackToCart}
                  variant="outline"
                  className="w-full mt-3"
                >
                  Back to Cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Panel */}
      <AddressPanel open={isAddressPanelOpen} onOpenChange={setIsAddressPanelOpen} />
    </div>
  );
}
