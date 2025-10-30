import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { productService } from "../services/productService";
import { FixedPriceListing } from "../types/product";
import { toast } from "sonner";

interface FeaturedProductsProps {
  onNavigate?: (page: string) => void;
}

export function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  const [listings, setListings] = useState<FixedPriceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getFeaturedProducts(8);
      setListings(data);
    } catch (error) {
      console.error("Failed to load featured products:", error);
      toast.error("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return `PKR ${parseFloat(price).toLocaleString()}`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handpicked treasures from skilled Pakistani artisans, each piece a testament to traditional craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => {
            const product = listing.product;
            const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
            
            return (
              <Card 
                key={listing.id} 
                className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate?.(`listing/${listing.id}`)}
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={primaryImage?.image_url || ""}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-white hover:bg-white hover:text-red-500"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <div className="absolute top-3 left-3 bg-emerald-700 text-white px-3 py-1 rounded-full text-sm">
                    {product.category_name}
                  </div>
                  {product.condition !== 'new' && (
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs capitalize">
                      {product.condition.replace('_', ' ')}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                    by {product.seller_profile?.brand_name || product.seller_username}
                  </p>
                  {product.average_rating !== null && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-700">{product.average_rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.total_reviews})</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-semibold text-lg">{formatPrice(listing.price)}</span>
                      {listing.quantity > 0 ? (
                        <span className="text-xs text-gray-500">{listing.quantity} in stock</span>
                      ) : (
                        <span className="text-xs text-red-600">Out of stock</span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-emerald-700 hover:bg-emerald-800"
                      disabled={listing.quantity === 0}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        toast.info("Add to cart feature coming soon!");
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {listing.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            onClick={() => onNavigate?.("products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
