import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Heart, ArrowLeftRight, ShoppingCart, Minus, Plus, Truck, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Product, mockProducts } from "../data/mockProducts";
import { FixedPriceListing } from "../types/product";
import { ProductCard } from "./ProductCard";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { productService } from "../services/productService";
import { toast } from "sonner";

interface ProductDetailPageProps {
  product?: Product;
  listing?: FixedPriceListing;
  onBack: () => void;
  onProductClick?: (product: Product) => void;
  onNavigate?: (page: "home" | "products") => void;
}

export function ProductDetailPage({ product: propProduct, listing: propListing, onBack, onProductClick, onNavigate }: ProductDetailPageProps) {
  const { id: paramId } = useParams<{ id: string }>();
  const [product, setProduct] = useState(propProduct);
  const [listing, setListing] = useState(propListing);
  const [loading, setLoading] = useState(!propProduct && !propListing);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Load listing from backend if ID provided in URL
  useEffect(() => {
    const loadListing = async () => {
      if (!propProduct && !propListing && paramId) {
        try {
          setLoading(true);
          const response = await productService.getFixedPriceListings({ page_size: 1 });
          const found = response.results.find(l => l.id.toString() === paramId);
          if (found) {
            setListing(found);
          } else {
            // Try mock products as fallback
            const foundProduct = mockProducts.find(p => p.id.toString() === paramId);
            if (foundProduct) {
              setProduct(foundProduct);
            }
          }
        } catch (error) {
          console.error('Failed to load listing:', error);
          toast.error('Failed to load product details');
        } finally {
          setLoading(false);
        }
      }
    };
    loadListing();
  }, [paramId, propProduct, propListing]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        <span className="ml-3 text-gray-600">Loading product...</span>
      </div>
    );
  }

  if (!product && !listing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  // Support both backend listing and mock product
  const isBackendListing = !!listing;
  const displayProduct = listing ? listing.product : product;
  const price = listing ? parseFloat(listing.price) : product?.price || 0;
  const inStock = listing ? listing.quantity > 0 : product?.inStock || false;
  const stockCount = listing ? listing.quantity : (product?.inStock ? Math.floor(Math.random() * 50) + 10 : 0);
  
  if (!displayProduct) return null;

  // Type-safe access to backend product
  const backendProduct = isBackendListing ? displayProduct as any : null;
  const productId = listing ? listing.id : product?.id || 0;
  const isWishlisted = isInWishlist(productId);

  // Images
  const productImages = isBackendListing 
    ? (backendProduct?.images || [])
    : [product?.image, product?.image, product?.image, product?.image].filter(Boolean);

  const discount = !isBackendListing && product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Get related products - same category, excluding current product
  const relatedProducts = mockProducts
    .filter((p) => product && (p.id !== product.id && (p.category === product.category || p.region === product.region)))
    .slice(0, 8);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlistClick = () => {
    if (product) {
      toggleWishlist(product);
    } else {
      toast.info("Wishlist feature coming soon for backend products!");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} x ${displayProduct.name} added to cart!`);
    } else {
      toast.info("Add to cart feature coming soon!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
          
          {/* Simple Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("home");
              }}
              className="text-gray-600 hover:text-emerald-700 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("products");
              }}
              className="text-gray-600 hover:text-emerald-700 transition-colors"
            >
              Products
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{isBackendListing ? backendProduct?.category_name : product?.category}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-emerald-700">{displayProduct.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px]">
                {productImages.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-emerald-700 ring-2 ring-emerald-200"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <img
                      src={isBackendListing ? img?.image_url : img}
                      alt={`${displayProduct.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={isBackendListing ? productImages[selectedImage]?.image_url : productImages[selectedImage]}
                  alt={displayProduct.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white hover:bg-red-600">
                      {discount}% OFF
                    </Badge>
                  </div>
                )}
                {(listing?.featured || product?.featured) && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-700 text-white hover:bg-emerald-800">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col">
              <div className="flex-1">
                {/* Product Title */}
                <h1 className="text-emerald-700 mb-2">{displayProduct.name}</h1>

                {/* Artisan/Brand */}
                <div className="mb-4">
                  <p className="text-gray-600">
                    By <span className="text-emerald-700">
                      {isBackendListing 
                        ? (backendProduct?.seller_profile?.brand_name || backendProduct?.seller_username)
                        : product?.artisan
                      }
                    </span>
                  </p>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const rating = isBackendListing ? (backendProduct?.average_rating || 0) : (product?.rating || 0);
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-gray-600">
                    ({isBackendListing ? (backendProduct?.total_reviews || 0) : (product?.reviews || 0)} reviews)
                  </span>
                </div>

                <Separator className="my-4" />

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-3">
                    {!isBackendListing && product?.originalPrice && (
                      <span className="text-gray-400 line-through">
                        PKR {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-emerald-700">
                      PKR {price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Stock Availability */}
                <div className="mb-6">
                  {inStock ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-emerald-700">
                        Available in Stock: <span className="text-gray-900">{stockCount} items</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-red-600">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {displayProduct.description}
                  {!isBackendListing && product?.region && (
                    <>. Handcrafted with care by skilled artisans from {product.region}, this piece represents the rich cultural heritage and traditional craftsmanship of Pakistan.</>
                  )}
                </p>

                {/* Region & Category Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {!isBackendListing && product?.region && (
                    <div>
                      <p className="text-gray-500">Region</p>
                      <p className="text-gray-900">{product.region}</p>
                    </div>
                  )}
                  {isBackendListing && backendProduct?.condition && (
                    <div>
                      <p className="text-gray-500">Condition</p>
                      <p className="text-gray-900 capitalize">{backendProduct.condition.replace('_', ' ')}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="text-gray-900">
                      {isBackendListing ? backendProduct?.category_name : product?.category}
                    </p>
                  </div>
                </div>

                {/* Free Shipping Info */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Truck className="h-5 w-5" />
                    <span>Free Shipping (Est. Delivery Time 2-3 Days)</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="px-6 py-2 border-x border-gray-300 text-gray-900 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={!inStock || quantity >= stockCount}
                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="lg"
                    disabled={!inStock}
                    onClick={handleAddToCart}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    ADD TO CART
                  </Button>

                  {/* Wishlist & Compare */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleWishlistClick}
                      className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                      />
                      <span>{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 transition-colors">
                      <ArrowLeftRight className="h-5 w-5" />
                      <span>Add to Compare</span>
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {!isBackendListing && product?.tags && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-gray-600 border-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="description" className="flex-1 sm:flex-none">
                  Description
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 sm:flex-none">
                  Reviews ({isBackendListing ? (backendProduct?.total_reviews || 0) : (product?.reviews || 0)})
                </TabsTrigger>
                <TabsTrigger value="artisan" className="flex-1 sm:flex-none">
                  {isBackendListing ? 'Seller Info' : 'Artisan Info'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-emerald-700 mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {displayProduct.description}
                    {!isBackendListing && product?.region && (
                      <>. This authentic Pakistani handcrafted item showcases the exceptional skills and traditional techniques passed down through generations of artisans in {product.region}.</>
                    )}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Each piece is carefully crafted using time-honored methods, ensuring that every item is unique and carries the rich cultural heritage of Pakistan. The attention to detail and quality of craftsmanship makes this a perfect addition to your collection or a thoughtful gift for someone special.
                  </p>
                  <h4 className="text-emerald-700 mb-3 mt-6">Key Features:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                    <li>100% Handcrafted by skilled Pakistani artisans</li>
                    {!isBackendListing && product?.category && product?.region && (
                      <li>Authentic {product.category.toLowerCase()} from {product.region}</li>
                    )}
                    {isBackendListing && (
                      <li>Condition: {backendProduct?.condition?.replace('_', ' ')}</li>
                    )}
                    <li>Traditional techniques and premium materials</li>
                    <li>Each piece is unique with slight variations</li>
                    <li>Supports local artisan communities</li>
                    <li>Perfect for gifting or personal collection</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed">
                    By purchasing this item, you're not only getting a beautiful handcrafted product, but you're also supporting the livelihoods of talented Pakistani artisans and helping preserve traditional crafts for future generations.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-gray-900">Excellent Quality!</span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Beautiful craftsmanship and authentic design. Exactly as described and arrived in perfect condition. Highly recommend!
                      </p>
                      <p className="text-gray-500">- Ayesha K., Karachi</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-900">Great Purchase</span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Love the traditional design and quality. Fast shipping too! Would definitely buy again.
                      </p>
                      <p className="text-gray-500">- Ahmed R., Lahore</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-gray-900">Highly Satisfied</span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Authentic Pakistani craftsmanship at its finest. The attention to detail is remarkable. Perfect addition to my home!
                      </p>
                      <p className="text-gray-500">- Fatima S., Islamabad</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="artisan" className="mt-6">
                <div className="prose max-w-none">
                  {isBackendListing ? (
                    <>
                      <h3 className="text-emerald-700 mb-4">
                        About {backendProduct?.seller_profile?.brand_name || backendProduct?.seller_username}
                      </h3>
                      {backendProduct?.seller_profile?.biography && (
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {backendProduct.seller_profile.biography}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-500">Seller Rating</p>
                          <p className="text-gray-900">
                            {backendProduct?.seller_profile?.average_rating || 'N/A'} ⭐
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Verified</p>
                          <p className="text-gray-900">
                            {backendProduct?.seller_profile?.is_verified ? '✓ Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        This seller is committed to providing quality handcrafted products and excellent customer service.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-emerald-700 mb-4">About {product?.artisan}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {product?.artisan} is a renowned name in Pakistani traditional crafts, based in the culturally rich region of {product?.region}. With years of experience and dedication to preserving traditional techniques, they have become synonymous with quality and authenticity.
                      </p>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        The artisans at {product?.artisan} are committed to maintaining the highest standards of craftsmanship while supporting their local communities. Each piece they create tells a story of Pakistan's rich cultural heritage and the skilled hands that bring these traditions to life.
                      </p>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-6">
                        <h4 className="text-emerald-700 mb-2">Why Choose {product?.artisan}?</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                          <li>Generations of traditional craftsmanship</li>
                          <li>Commitment to quality and authenticity</li>
                          <li>Support for local artisan communities</li>
                          <li>Sustainable and ethical production practices</li>
                          <li>Preservation of Pakistani cultural heritage</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-emerald-700 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}