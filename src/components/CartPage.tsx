import { X, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "../contexts/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CartPageProps {
  onContinueShopping: () => void;
  onCheckout?: () => void;
}

export function CartPage({ onContinueShopping, onCheckout }: CartPageProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loading } = useCart();
  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleRemove = async (productId: number) => {
    await removeFromCart(productId);
  };

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    await updateQuantity(productId, newQuantity);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding some amazing Pakistani crafts to your cart!
            </p>
            <Button
              onClick={onContinueShopping}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h1 className="text-2xl text-gray-900">Your Cart</h1>
                <p className="text-sm text-gray-500">
                  There are {cartItems.length} product{cartItems.length !== 1 ? 's' : ''} in your cart
                </p>
              </div>

              {/* Cart Items */}
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const discountPercentage = item.product.originalPrice
                    ? Math.round(
                        ((item.product.originalPrice - item.product.price) /
                          item.product.originalPrice) *
                          100
                      )
                    : 0;

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 pb-6 border-b last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Brand/Artisan */}
                        <p className="text-xs text-emerald-700 mb-1">
                          {item.product.artisan}
                        </p>

                        {/* Product Name */}
                        <h3 className="text-gray-900 mb-2 line-clamp-2">
                          {item.product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(item.product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* Size and Quantity */}
                          <div className="flex flex-wrap items-center gap-4 mb-3">
                          {item.size && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Size:</span>
                              <span className="text-sm">{item.size}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Qty:</span>
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(value) =>
                                handleQuantityChange(item.product.id, parseInt(value))
                              }
                              disabled={loading}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                          <span className="text-gray-900">
                            ₨{item.product.price.toLocaleString()}
                          </span>
                          {item.product.originalPrice && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ₨{item.product.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-red-500">
                                {discountPercentage}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors h-fit"
                        aria-label="Remove item"
                        disabled={loading}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cart Totals - Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">Cart Totals</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-red-500">₨{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-emerald-700">Free</span>
                </div>

                <div className="pb-3 border-b">
                  <span className="text-sm text-gray-500">Estimate for</span>
                  <p className="text-sm text-gray-700 mt-1">Pakistan</p>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-red-500">₨{total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                CHECKOUT
              </Button>

              <Button
                onClick={onContinueShopping}
                variant="outline"
                className="w-full mt-3"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
