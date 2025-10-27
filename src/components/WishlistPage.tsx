import { Heart, ShoppingCart, X } from "lucide-react";
import { Button } from "./ui/button";
import { useWishlist } from "../contexts/WishlistContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "../data/mockProducts";

interface WishlistPageProps {
  onProductClick?: (product: Product) => void;
  onContinueShopping?: () => void;
}

export function WishlistPage({ onProductClick, onContinueShopping }: WishlistPageProps) {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-emerald-700">My Wishlist</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-emerald-700 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length === 0
              ? "There are 0 products in your Wishlist"
              : `There are ${wishlistItems.length} product${wishlistItems.length === 1 ? '' : 's'} in your Wishlist`}
          </p>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="mb-6 relative">
                <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-emerald-300" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
              <h2 className="text-gray-900 mb-2">My List is currently empty</h2>
              <p className="text-gray-600 mb-6">
                Start adding products to your wishlist by clicking the heart icon on any product
              </p>
              <Button
                onClick={onContinueShopping}
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          </div>
        ) : (
          /* Wishlist Items */
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {wishlistItems.map((product) => {
                const discountPercentage = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div 
                      className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => onProductClick?.(product)}
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white hover:bg-red-600 text-xs">
                            {discountPercentage}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 
                              className="text-gray-900 hover:text-emerald-700 cursor-pointer transition-colors"
                              onClick={() => onProductClick?.(product)}
                            >
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600">by {product.artisan}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-emerald-700">{product.category}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{product.region}</span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-emerald-700">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              Rs. {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        {product.inStock ? (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            <span className="text-sm text-emerald-700">In Stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm text-red-600">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2">
                        <Button
                          size="sm"
                          disabled={!product.inStock}
                          className="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
