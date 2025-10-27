import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { listingApi, FixedPriceListing } from "../services/api";

interface FeaturedProductsProps {
  onNavigate?: (page: "products") => void;
}

export function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  const navigate = useNavigate();
  const [listings, setListings] = useState<FixedPriceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingApi.getListings({ status: 'active' });
        console.log('FeaturedProducts - API Response:', response); // Debug log
        if (response.data) {
          console.log('FeaturedProducts - Raw listings:', response.data.results); // Debug log
          
          // Check the structure of the first listing
          if (response.data.results.length > 0) {
            console.log('FeaturedProducts - First listing structure:', response.data.results[0]);
            console.log('FeaturedProducts - Product structure:', response.data.results[0].product);
            console.log('FeaturedProducts - Featured field:', response.data.results[0].featured);
          }
          
          // Filter to only show featured products, then take first 4
          const featuredListings = response.data.results.filter(listing => listing.featured);
          console.log('FeaturedProducts - Featured listings:', featuredListings); // Debug log
          setListings(featuredListings.slice(0, 4));
        } else if (response.error) {
          console.log('FeaturedProducts - API Error:', response.error); // Debug log
          setError(response.error);
        }
      } catch (err) {
        console.log('FeaturedProducts - Fetch error:', err); // Debug log
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Featured Products</h2>
            <div className="flex justify-center space-x-2">
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || listings.length === 0) {
    return null; // Don't show section if no products or error
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
            const primaryImage = listing.product.images.find(img => img.is_primary) || listing.product.images[0];
            
            return (
              <Card 
                key={listing.id} 
                className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${listing.product.id}`)}
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={primaryImage?.image_url || '/placeholder-image.jpg'}
                    alt={listing.product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-white hover:bg-white hover:text-red-500"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <div className="absolute top-3 left-3 bg-emerald-700 text-white px-3 py-1 rounded-full text-sm">
                    {listing.product.category_name}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-gray-900 mb-2 line-clamp-2">{listing.product.name}</h3>
                  {listing.product.average_rating && listing.product.total_reviews ? (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-700">{listing.product.average_rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-500">({listing.product.total_reviews})</span>
                    </div>
                  ) : (
                    <div className="mb-3 text-sm text-gray-500">No reviews yet</div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700 font-semibold">Rs {parseFloat(listing.price).toLocaleString()}</span>
                    <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
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
