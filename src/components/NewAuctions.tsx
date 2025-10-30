import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Gavel, TrendingUp } from "lucide-react";
import { productService } from "../services/productService";
import { Auction } from "../types/product";
import { toast } from "sonner";

interface NewAuctionsProps {
  onNavigate?: (page: string) => void;
}

export function NewAuctions({ onNavigate }: NewAuctionsProps) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      const data = await productService.getNewAuctions(6);
      setAuctions(data);
    } catch (error) {
      console.error("Failed to load auctions:", error);
      toast.error("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatPrice = (price: string) => {
    return `PKR ${parseFloat(price).toLocaleString()}`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Live Auctions</h2>
            <p className="text-gray-600">Loading auctions...</p>
          </div>
        </div>
      </section>
    );
  }

  if (auctions.length === 0) {
    return null; // Don't show section if no auctions
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gavel className="h-8 w-8 text-emerald-700" />
            <h2 className="text-gray-900">Live Auctions</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bid on unique handcrafted items. Don't miss out on these exclusive pieces!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => {
            const primaryImage = auction.product.images.find(img => img.is_primary) || auction.product.images[0];
            
            return (
              <Card 
                key={auction.id} 
                className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate?.(`auction/${auction.id}`)}
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={primaryImage?.image_url || ""}
                    alt={auction.product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeRemaining(auction.time_remaining)}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-700 text-white px-3 py-1 rounded-full text-sm">
                    {auction.product.category_name}
                  </div>
                  {auction.product.seller_profile?.is_verified && (
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      ✓ Verified Seller
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-gray-900 mb-2 line-clamp-2">{auction.product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                    by {auction.product.seller_profile?.brand_name || auction.product.seller_username}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Bid:</span>
                      <span className="text-lg font-semibold text-emerald-700">
                        {formatPrice(auction.current_price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Starting:</span>
                      <span className="text-gray-700">{formatPrice(auction.starting_price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>{auction.total_bids} bids</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-emerald-700 hover:bg-emerald-800"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onNavigate?.(`auction/${auction.id}`);
                      }}
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
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
            onClick={() => onNavigate?.("auctions")}
          >
            View All Auctions
          </Button>
        </div>
      </div>
    </section>
  );
}
