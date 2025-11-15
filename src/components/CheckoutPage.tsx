import { useState } from "react";
import { MapPin, Plus, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "../contexts/CartContext";
import { useAddress } from "../contexts/AddressContext";
import { useAuth } from "../contexts/AuthContext";
import { AddressPanel } from "./AddressPanel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { MOCK_MODE } from "../lib/mockMode";
import { useNavigate } from "react-router-dom";

interface CheckoutPageProps {
  onBackToCart?: () => void;
  onOrderSuccess?: () => void;
}

export function CheckoutPage({ onBackToCart, onOrderSuccess }: CheckoutPageProps) {
  const { cartItems, getCartTotal, checkout, loading } = useCart();
  const { addresses, getDefaultAddress } = useAddress();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddressPanelOpen, setIsAddressPanelOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("stripe");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const defaultAddress = getDefaultAddress();

  const handleCheckout = async () => {
    if (!defaultAddress) {
      toast.error("Please add a delivery address");
      return;
    }
    
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (MOCK_MODE) {
      // Mock mode - just navigate to success page
      setIsProcessing(true);
      try {
        const result = await checkout(defaultAddress.id);
        if (result.success) {
          toast.success("Order placed successfully!");
          if (onOrderSuccess) {
            onOrderSuccess();
          }
        } else {
          toast.error(result.error || "Checkout failed");
        }
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Backend mode - create actual order and redirect to payment
    setIsProcessing(true);
    try {
      const result = await checkout(defaultAddress.id);
      
      if (result.success && result.order) {
        toast.success("Order created successfully!");
        
        // Redirect to Stripe payment URL
        if (result.order.payment_url) {
          window.location.href = result.order.payment_url;
        } else if (onOrderSuccess) {
          onOrderSuccess();
        }
      } else {
        toast.error(result.error || "Checkout failed");
      }
    } catch (error: any) {
      console.error('Error during checkout:', error);
      toast.error('Failed to place order');
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
                        address.is_default
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 uppercase">
                              Home
                            </span>
                            {address.is_default && (
                              <span className="px-2 py-1 bg-emerald-600 text-white rounded text-xs">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-900">
                            {address.street_address}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.city_name}, {address.province_name} - {address.postal_code}
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
              <h2 className="text-xl text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                {/* Stripe Payment */}
                <div className={`w-full p-4 border-2 rounded-lg ${
                  selectedPaymentMethod === "stripe"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">Stripe Payment</span>
                      <p className="text-xs text-gray-500">Secure payment via Stripe</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💳 You will be redirected to Stripe to complete your payment securely.
                  </p>
                </div>
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
                disabled={!defaultAddress || isProcessing || loading}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isProcessing || loading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
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
