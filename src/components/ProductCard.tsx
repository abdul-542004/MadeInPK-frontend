import { ShoppingCart, Star, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Product } from "../data/mockProducts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner@2.0.3";

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => onProductClick?.(product)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!product.inStock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-emerald-700">{discountPercentage}% OFF</Badge>
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
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category and Region */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-emerald-700">{product.category}</span>
          <span className="text-xs text-gray-500">{product.region}</span>
        </div>

        {/* Product Name */}
        <h3 
          className="text-gray-900 mb-1 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-emerald-700 transition-colors"
          onClick={() => onProductClick?.(product)}
        >
          {product.name}
        </h3>

        {/* Artisan */}
        <p className="text-xs text-gray-600 mb-3">by {product.artisan}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-emerald-700">Rs. {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
