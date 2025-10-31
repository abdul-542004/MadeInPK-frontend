import { ShoppingCart, Star, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Product } from "../data/mockProducts";
import { FixedPriceListing } from "../types/product";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product?: Product;
  listing?: FixedPriceListing;
  onProductClick?: (product: Product) => void;
  onListingClick?: (listing: FixedPriceListing) => void;
}

export function ProductCard({ product, listing, onProductClick, onListingClick }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Support both old Product and new FixedPriceListing
  const isBackendListing = !!listing;
  const displayProduct = listing ? listing.product : product;
  const price = listing ? parseFloat(listing.price) : product?.price || 0;
  const inStock = listing ? listing.quantity > 0 : product?.inStock || false;
  const productId = listing ? listing.id : product?.id || 0;
  
  if (!displayProduct) return null;
  
  const isWishlisted = isInWishlist(productId);
  
  // Type-safe access to backend product properties
  const backendProduct = isBackendListing ? displayProduct as any : null;
  const primaryImage = backendProduct?.images?.find((img: any) => img.is_primary) || backendProduct?.images?.[0];
  const imageUrl = primaryImage ? primaryImage.image_url : (product?.image || '');
  
  const discountPercentage = 0; // Backend doesn't have originalPrice yet

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const realProductId = listing ? listing.product.id : product?.id;
    if (realProductId) {
      await toggleWishlist(realProductId, displayProduct.name);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.info("Add to cart feature coming soon!");
    }
  };

  const handleCardClick = () => {
    if (listing && onListingClick) {
      onListingClick(listing);
    } else if (product && onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
        onClick={handleCardClick}
      >
        <ImageWithFallback
          src={imageUrl}
          alt={displayProduct.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!inStock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-emerald-700">{discountPercentage}% OFF</Badge>
          )}
          {listing?.featured && (
            <Badge className="bg-yellow-500">Featured</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 bg-white rounded-full p-2 transition-all hover:bg-emerald-50 ${
            isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isWishlisted 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-emerald-700'
            }`} 
          />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            size="sm"
            disabled={!inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category and Seller */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-emerald-700">
            {isBackendListing ? backendProduct?.category_name : product?.category}
          </span>
          {isBackendListing && (
            <span className="text-xs text-gray-500">
              {backendProduct?.seller_profile?.brand_name || backendProduct?.seller_username}
            </span>
          )}
          {!isBackendListing && product && (
            <span className="text-xs text-gray-500">{product.region}</span>
          )}
        </div>

        {/* Product Name */}
        <h3 
          className="text-gray-900 mb-1 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-emerald-700 transition-colors"
          onClick={handleCardClick}
        >
          {displayProduct.name}
        </h3>

        {/* Seller/Artisan */}
        {!isBackendListing && product && (
          <p className="text-xs text-gray-600 mb-3">by {product.artisan}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {isBackendListing ? (
            <>
              <span className="text-sm text-gray-700">
                {backendProduct?.average_rating ? backendProduct.average_rating.toFixed(1) : 'N/A'}
              </span>
              <span className="text-xs text-gray-500">({backendProduct?.total_reviews || 0})</span>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-700">{product?.rating || 0}</span>
              <span className="text-xs text-gray-500">({product?.reviews || 0})</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-emerald-700">PKR {price.toLocaleString()}</span>
          {!isBackendListing && product?.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
          {isBackendListing && listing && listing.quantity > 0 && (
            <span className="text-xs text-gray-500">({listing.quantity} in stock)</span>
          )}
        </div>
      </div>
    </div>
  );
}
