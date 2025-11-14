import { X, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { useCart } from "../contexts/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CartPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewCart: () => void;
  onCheckout?: () => void;
}

export function CartPanel({ open, onOpenChange, onViewCart, onCheckout }: CartPanelProps) {
  const { cartItems, removeFromCart, getCartCount, getCartTotal, loading } = useCart();
  const itemCount = getCartCount();
  const total = getCartTotal();

  const handleRemove = async (productId: number) => {
    await removeFromCart(productId);
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  const handleViewCart = () => {
    onOpenChange(false);
    onViewCart();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="border-b pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            View and manage items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
            <div className="relative mb-6">
              <ShoppingCart className="h-24 w-24 text-gray-300" strokeWidth={1.5} />
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-2">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-gray-600 mb-6 text-center">Your Cart is currently empty</p>
            <Button
              onClick={handleContinueShopping}
              className="bg-red-500 hover:bg-red-600 text-white px-8"
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm line-clamp-2 mb-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">Qty: {item.quantity}</p>
                      <p className="text-red-500">
                        ₨{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-5 pb-6 px-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{itemCount} Item</span>
                  <span className="text-red-500">₨{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total (tax excl.)</span>
                  <span>₨{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleViewCart}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  VIEW CART
                </Button>
                <Button
                  onClick={onCheckout}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                >
                  CHECKOUT
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}